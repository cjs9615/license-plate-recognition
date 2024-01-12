
# 번호판 탐지 모델
def result_license_plate(model, img, threshold):
    # perform inference
    results = model(img, size=640)

    # inference with test time augmentation
    results = model(img, augment=True)

    # parse results
    predictions = results.pred[0]
    boxes = predictions[:, :4] # x1, y1, x2, y2
    scores = predictions[:, 4]
    categories = predictions[:, 5]

    result = []
    #print('번호판 정확도',scores[0])
    # show detection bounding boxes on image
    if (len(boxes) > 0) and scores[0]>=threshold:
        
        # Get the coordinates of the first bounding box
        coordinates = list(map(int, boxes[0]))

        # for box in boxes :
        #   coordinates.append(list(map(int, box)))

        # Get the coordinates of the first bounding box
        # x1, y1, x2, y2 = map(int, boxes[0])

        # Crop the license plate region from the original image
        license_plate_img = img.crop((coordinates[0], coordinates[1], coordinates[2], coordinates[3]))
        result.append(license_plate_img)
        result.append(coordinates)

        # Save or display the cropped license plate image
        license_plate_img.save("./images/"+'license_plate_img'+'.jpg','JPEG')
        return result

    else : return result.append('no license_plate')