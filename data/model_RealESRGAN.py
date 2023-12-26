import torch
from RealESRGAN import RealESRGAN
from PIL import Image

def model_RealESRGAN():
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    model = RealESRGAN(device, scale=4)
    model.load_weights('weights/RealESRGAN_x4.pth', download=True)

    path_to_image = './images/license_plate_img.jpg'
    image = Image.open(path_to_image).convert('RGB')

    sr_image = model.predict(image)

    sr_image.save('./images/sr_img.jpg')