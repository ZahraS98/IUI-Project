from flask import Flask, request
import os


app = Flask(__name__)

@app.route("/input", methods=['GET', 'POST'])
def register():
    input_file = request.files['inputFile']
    fileType = "wav"
    nfile_name = "inputFile." + fileType
    input_file.name = nfile_name
    input_file.save(os.path.join("input", input_file.filename))
    os.rename("input/"+input_file.filename, "input/"+nfile_name)
    return input_file.filename


@app.route("/test")
def test():
    return "something"


app.run()
