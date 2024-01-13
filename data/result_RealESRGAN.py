
# 이미지 화질 개선
def result_RealESRGAN(model, img):
    sr_image = model.predict(img)
    sr_image.save('./images/sr_img.jpg')
    return sr_image