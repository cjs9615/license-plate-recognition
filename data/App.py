from flask import Flask, request, jsonify
from PIL import Image
import requests
import base64
from model_license_plate import model_license_plate
from model_TrOCR import model_TrOCR
from model_RealESRGAN import model_RealESRGAN

app = Flask(__name__)

@app.route('/')
def hello():
    return 'hello'

@app.route('/receive_string', methods=['POST'])
def receive_string():
	#Spring으로부터 JSON 객체를 전달받음
    dto_json = request.get_json()

    if(dto_json['url'] != '') :
        # 이미지 불러오기
        img = Image.open(requests.get(dto_json['url'], stream=True).raw)
        #img = Image.open(dto_json['url'])
    else:
        img = Image.open(dto_json['local'])
    

    #번호판 이미지 추출
    license_plate_img = model_license_plate(img)
    if(license_plate_img == 'no license_plate') : 
        return jsonify({'err': 'no license_plate'})
    
    image_path = './images/license_plate_img.jpg'
    # 이미지 파일을 Base64로 인코딩
    with open(image_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode('utf-8')

    #이미지 화질 개선
    model_RealESRGAN()

    #TrOCR
    generated_text = model_TrOCR()

    # JSON 응답을 생성
    response = {
        'result': generated_text,
        'image': encoded_image,
        'format': 'jpeg'  # 이미지 형식에 따라 수정 가능
    }
    
    #Spring으로 response 전달
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)