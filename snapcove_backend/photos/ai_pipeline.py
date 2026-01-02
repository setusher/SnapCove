from PIL import Image
import exifread
import torch
from torchvision import models, transforms

model = models.resnet50(weights="IMAGENET1K_V1")
model.eval()

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

def extract_exif(path):
    with open(path, 'rb') as f:
        tags = exifread.process_file(f)

    camera = str(tags.get("Image Model", ""))
    gps = tags.get("GPS GPSLatitude")

    return camera, gps, tags


def run_resnet(path):
    img = Image.open(path).convert("RGB")
    input_tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)
        probs = torch.nn.functional.softmax(output[0], dim=0)
        top = torch.topk(probs, 5)

    labels = [models.ResNet50_Weights.IMAGENET1K_V1.meta["categories"][i] for i in top.indices]
    return labels

def process_photo(photo):
    photo.processing_status = "processing"
    photo.save()

    camera, gps, exif = extract_exif(photo.image.path)
    labels = run_resnet(photo.image.path)

    photo.camera_model = camera
    photo.gps_location = str(gps)
    photo.exif_data = exif
    photo.ai_tags = labels
    photo.processing_status = "done"
    photo.save()