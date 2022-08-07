import qrcode
from PIL import Image
from cryptography.fernet import Fernet

def encode(key,text):
    cipher_suite = Fernet(key.encode())
    encoded_text = cipher_suite.encrypt(text.encode())
    return encoded_text
def qrgen(link,brand,product,outimg):
    # import modules
    QRcode = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H
    )

    # taking url or text
    url = f'{link}?brand={brand}&product={product}'

    # adding URL or text to QRcode
    QRcode.add_data(url)

    # generating QR code
    QRcode.make()

    # taking color name from user
    QRcolor = 'black'

    # adding color to QR code
    QRimg = QRcode.make_image(
        fill_color=QRcolor, back_color="#DCDCDC").convert('RGB')

    # save the QR code generated
    QRimg.save(outimg)