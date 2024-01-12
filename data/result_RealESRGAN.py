import torch
from RealESRGAN import RealESRGAN
from PIL import Image

def result_RealESRGAN(model, img):
    sr_image = model.predict(img)
    sr_image.save('./images/sr_img.jpg')
    return sr_image