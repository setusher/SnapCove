import os
import time
from PIL import Image
import exifread
import torch
import open_clip
from torchvision import models, transforms

clip_model, _, clip_preprocess = open_clip.create_model_and_transforms(
    'ViT-B-32',
    pretrained='laion2b_s34b_b79k'
)
tokenizer = open_clip.get_tokenizer('ViT-B-32')

SEMANTIC_TAGS = [
    "concert", "wedding", "birthday party", "conference", "seminar",
    "college event", "certificate ceremony", "sports event",
    "crowd", "stage", "presentation", "festival", "family gathering",
    "outdoor event", "indoor event"
]

# Load ResNet50 once
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
model.eval()

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

# -------- EXIF --------

def extract_exif(path):
    with open(path, 'rb') as f:
        tags = exifread.process_file(f, details=False)

    camera = str(tags.get("Image Model", ""))
    gps = str(tags.get("GPS GPSLatitude", ""))
    capture_time = tags.get("EXIF DateTimeOriginal")

    # convert to real JSON dict
    clean_exif = {k: str(v) for k, v in tags.items()}

    return camera, gps, capture_time, clean_exif


# -------- RESNET --------

def run_resnet(path):
    import exifread
    tags = []

    with open(path, 'rb') as f:
        exif = exifread.process_file(f, details=False)

    def g(t): return exif.get(t)

    iso = g("EXIF ISOSpeedRatings")
    if iso and int(str(iso)) > 800:
        tags.append("low-light")

    exposure = str(g("EXIF ExposureTime") or "")
    if "/" in exposure:
        n, d = map(float, exposure.split("/"))
        if n/d > 0.1:
            tags.append("long-exposure")

    focal = g("EXIF FocalLength")
    if focal:
        f = float(str(focal).split("/")[0])
        if f < 28: tags.append("wide-angle")
        if f > 85: tags.append("telephoto")

    if g("EXIF Flash") and "Flash fired" in str(g("EXIF Flash")):
        tags.append("flash-used")

    if g("GPS GPSLatitude"):
        tags.append("gps-present")

    make = str(g("Image Make") or "").lower()
    if any(x in make for x in ["iphone","samsung","pixel"]):
        tags.append("camera-phone")

    software = str(g("Image Software") or "").lower()
    if software and "camera" not in software:
        tags.append("edited-image")

    if not tags:
        tags.append("standard-photo")

    return tags


# -------- MAIN PIPELINE --------

def process_photo(photo):
    print(">>> ENTERED REAL PIPELINE <<<", photo.id)

    # wait until file exists (macOS Celery fix)
    for _ in range(30):
        photo.refresh_from_db()
        if photo.image and os.path.exists(photo.image.path):
            break
        time.sleep(0.5)

    if not photo.image or not os.path.exists(photo.image.path):
        print("IMAGE NEVER ATTACHED — FAILING")
        photo.processing_status = "failed"
        photo.save()
        return

    photo.processing_status = "processing"
    photo.save()

    camera, gps, capture_time, exif = extract_exif(photo.image.path)
    labels = run_resnet(photo.image.path)

    photo.camera_model = camera
    photo.gps_location = gps
    photo.capture_time = capture_time
    photo.exif_data = exif
    photo.ai_tags = labels
    photo.processing_status = "done"

    photo.save(update_fields=[
        "exif_data",
        "ai_tags",
        "processing_status",
        "camera_model",
        "gps_location",
        "capture_time"
    ])

    print(">>> PHOTO METADATA SAVED <<<")
