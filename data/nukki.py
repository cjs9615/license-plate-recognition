from rembg import remove
from PIL import Image
import os

folder_path = 'D:/TechTri/test_truck_large'
output_path = 'D:/TechTri/test_nukki_large'

total_img = os.listdir(folder_path)

for img_fullname in total_img :
    img_path = folder_path + '/' + img_fullname
    img_name = img_fullname.split('.')[0]
    input = Image.open(img_path)

    output = remove(input)
    output.save(output_path + '/' + img_name + ".png")