from flask import Flask, request, jsonify
from PIL import Image
import requests
import base64
from model_license_plate import model_license_plate
from model_TrOCR import model_TrOCR
from model_RealESRGAN import model_RealESRGAN
from model_truck_detection import model_truck_detection

app = Flask(__name__)

@app.route('/receive_image_url', methods=['POST'])
def receive_imgage_url():
	#Spring으로부터 JSON 객체를 전달받음
    dto_json = request.get_json()

    # JSON 응답을 생성
    response = {
        'result': '',
        'license_plate_image': '',
        'truck_image': '',
        'format': '',  # 이미지 형식에 따라 수정 가능
        'success': '',
        'message': ''
    }

    if(dto_json['url'] != '') :
        # 이미지 불러오기
        img = Image.open(requests.get(dto_json['url'], stream=True).raw).convert("RGB")
        #img = Image.open(dto_json['url'])
    else:
        img = Image.open(dto_json['local'])
    

    #번호판 이미지 추출
    license_plate_result = model_license_plate(img, threshold=0)
    license_plate_img = license_plate_result[0]
    license_plate_coordinate = license_plate_result[1]
    if(license_plate_img == 'no license_plate') : 
        response['success'] = False
        response['message'] = 'no license_plate'
        return jsonify(response)
    
    license_plate_img_path = './images/license_plate_img.jpg'
    # 이미지 파일을 Base64로 인코딩
    with open(license_plate_img_path, "rb") as image_file:
        encoded_license_plate_img = base64.b64encode(image_file.read()).decode('utf-8')

    model_truck_detection(img, license_plate_coordinate)

    truck_img_path = './images/truck_img.jpg'
    # 이미지 파일을 Base64로 인코딩
    with open(truck_img_path, "rb") as image_file:
        encoded_truck_img = base64.b64encode(image_file.read()).decode('utf-8')

    #이미지 화질 개선
    model_RealESRGAN()

    #TrOCR
    generated_text = model_TrOCR()

    response['result'] = generated_text
    response['license_plate_image'] = encoded_license_plate_img
    response['truck_image'] = encoded_truck_img
    response['format'] = 'jpeg'
    response['success'] = True
    
    #Spring으로 response 전달
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)