import os
from PIL import Image
from result_license_plate import model_license_plate
from result_TrOCR import model_TrOCR
from result_RealESRGAN import model_RealESRGAN
import re

def four_digits(label):
  #label = "~8105-"
  numbers = re.sub(r'[^0-9]', '', label) # 숫자만

  if len(label) > 4: # 4자리 이상일 때
    numbers = numbers[-4:]
  return numbers

folder_path_list = ['D:/TechTri/img_9000/dh','D:/TechTri/img_9000/hjg','D:/TechTri/img_9000/hjn','D:/TechTri/img_9000/mh']
correct_count = 0
total_count = 9534

for folder_path in folder_path_list:
  total_img = os.listdir(folder_path)
  print(folder_path)

  for img_fullname in total_img :
    img_path = folder_path + '/' + img_fullname
    img_name = img_fullname.split('.')[0]
    img = Image.open(img_path)

    #번호판 이미지 추출
    license_plate_img = model_license_plate(img, 0)
    if(license_plate_img == 'no license_plate') :
        print('no license_plate')
        result = 'no license_plate'

    else :
      #이미지 화질 개선
      model_RealESRGAN()

      #TrOCR
      generated_text = model_TrOCR()
      result = four_digits(generated_text)
      print(img_name, '의 ocr 예측 결과 : ', result)

      #easyocr
      # generated_text = model_easyocr()
      # result = four_digits(generated_text)
      # print('ocr 예측 결과 : ', result)

    if(img_name.split(" ")[0] == result) : correct_count += 1

accuracy = correct_count/total_count
print('전체 이미지 개수 :', total_count, '맞춘 개수', correct_count)
print('정확도 : ', accuracy)