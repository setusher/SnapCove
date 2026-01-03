from PIL import Image
import exifread
import torch
from torchvision import models, transforms

model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
model.eval()

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

def extract_exif(path):
    with open(path, 'rb') as f:
        tags = exifread.process_file(f, details=False)

    camera = str(tags.get("Image Model", ""))
    gps = str(tags.get("GPS GPSLatitude", ""))
    capture_time = tags.get("EXIF DateTimeOriginal")
    return camera, gps, capture_time, tags

def run_resnet(path):
    img = Image.open(path).convert("RGB")
    tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        out = model(tensor)

    probs = torch.nn.functional.softmax(out[0], dim=0)
    top = torch.topk(probs, 5).indices
    return [models.ResNet50_Weights.IMAGENET1K_V1.meta["categories"][i] for i in top]

def process_photo(photo):
    print(">>> ENTERED REAL PIPELINE <<<", photo.id)

    photo.refresh_from_db()
    photo.processing_status = "processing"
    photo.save()

    camera, gps, capture_time, exif = extract_exif(photo.image.path)
    labels = run_resnet(photo.image.path)

    photo.camera_model = camera
    photo.gps_location = gps
    photo.exif_data = exif
    photo.ai_tags = labels
    photo.processing_status = "done"
    photo.save()

    print(">>> PHOTO METADATA SAVED <<<")
