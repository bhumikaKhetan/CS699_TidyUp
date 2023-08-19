from flask import Flask, request, send_from_directory
import pandas as pd
import os
import glob
import matplotlib.pyplot as plt
import numpy as np
import graphs as graph
from setuptools.command import rotate
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config['uploadFolder'] = "./data_files/"
app.config['filePath'] = ""
app.config['filename'] = ""
app.config['updated_csv_file_name'] = "uploaded_data"
app.config['updated_data_version'] = 0

data_frame = None
na_columns=[]
current_response = None
original_data_frame = None

@app.route("/get-columns-list/", methods = ["GET","POST"])
def get_columns_list():
    return data_frame.columns.values.tolist()

@app.route("/replace-na-bfill/", methods=["GET", "POST"])
def replace_na_bfill():
    data_frame.bfill(axis="rows", inplace=True)
    return ""


@app.route("/replace-na-ffill/", methods=["GET", "POST"])
def replace_na_ffill():
    data_frame.ffill(axis="rows", inplace=True)
    return ""


@app.route("/replace-na-data/<column_name>/<replace_value>/", methods=["GET", "POST"])
def replace_na_values(column_name, replace_value):
    try:
        data_type = data_frame[column_name].dtype
        if data_type.kind in "iufc":
            data_frame[column_name].fillna(pd.to_numeric(replace_value), inplace=True)

        else:
            data_frame[column_name].fillna(replace_value, inplace=True)

    except Exception as e:
        print(str(e))
    return ""


@app.route("/replace-data/<column_name>/<original_value>/<replace_value>/", methods=["GET", "POST"])
def replace_values(column_name, original_value, replace_value):

    try:
        data_type = data_frame[column_name].dtype
        if data_type.kind in "iufc":
            data_frame[column_name].replace(pd.to_numeric(original_value),
                                        pd.to_numeric(replace_value), inplace=True)
        else:
            data_frame[column_name].replace(original_value,
                                            replace_value, inplace=True)
    except Exception as e:
        print(e, str(e))
    return ""


def return_original_data():
    global current_response
    response = send_from_directory(directory=app.config['uploadFolder'], path=app.config['filename'],
                                   as_attachment=True)
    response.headers['Content-Disposition'] = 'attachment; filename="' + app.config["filename"] + '"'
    response.headers['Content-Type'] = "application/octet-stream"
    response.headers['charset'] = "UTF-8"
    current_response = response


@app.route("/reset-data/", methods=["GET", "POST"])
def reset_data():
    global data_frame
    data_frame = pd.read_csv(app.config['filePath'])
    return_original_data()
    filepath = app.config['uploadFolder'] + app.config['updated_csv_file_name']
    for i in range(1, app.config['updated_data_version'] + 1):
        if os.path.exists(filepath + str(i) + ".csv"):
            os.remove(filepath + str(i) + ".csv")
    app.config['updated_data_version'] = 0
    return current_response


@app.route("/drop_NA_columns/", methods=["GET", "POST"])
def drop_na_columns():
    global data_frame
    data_frame = data_frame.dropna(axis=1)
    return ""


@app.route("/drop_NA_columns/<column_name>/", methods=["GET", "POST"])
def drop_na_column_name(column_name):
    global data_frame
    if data_frame[column_name].isnull().sum() != 0:
        data_frame = data_frame.drop(columns=[column_name])
    print(data_frame.shape)
    return ""


@app.route("/drop_NA_rows/", methods=["GET", "POST"])
def drop_na_rows():
    global data_frame
    data_frame = data_frame.dropna(axis=0)

    return ""


@app.route("/drop_NA_rows/<column_name>/", methods=["GET", "POST"])
def drop_na_row_column(column_name):
    global data_frame
    print(data_frame.describe())
    print(data_frame.shape)
    data_frame = data_frame[data_frame[column_name].notna()]
    print(data_frame.shape)
    return ""


@app.route("/upload-data", methods=["POST"])
def upload_data():
    print(request.method)
    if request.method == "POST":
        print(request.files)
        for i in request.files:
            print(i)
        if request.files:
            print(request.files)
            global data_frame
            global original_data_frame
            global na_columns
            file = request.files['file_data']
            app.config['filename'] = file.filename
            print(app.config['filename'])
            file.save(os.path.join(app.config['uploadFolder'], file.filename))
            
            app.config['filePath'] = app.config['uploadFolder'] + file.filename
            data_frame = pd.read_csv(app.config['filePath'])
            original_data_frame = pd.read_csv(app.config['filePath'])
            # print(data_frame.describe())
            # print(data_frame.info())
            for column in data_frame.columns.values.tolist():
                if original_data_frame[column].isna().sum() > 0:
                    na_columns.append(column)
    return ""


@app.route("/download_updated_data/", methods=["POST"])
def download_updated_data():
    app.config["updated_data_version"] = app.config["updated_data_version"] + 1
    file_path = app.config['uploadFolder'] + app.config['updated_csv_file_name'] + str(
        app.config['updated_data_version']) + ".csv"
    data_frame.to_csv(file_path, index=False)
    file_name = app.config['updated_csv_file_name'] + str(app.config['updated_data_version']) + ".csv"
    response = send_from_directory(directory=app.config['uploadFolder'], path=file_name,
                                   as_attachment=True)
    response.headers['Content-Disposition'] = 'attachment; filename="' + file_name + '"'
    response.headers['Content-Type'] = "application/octet-stream"
    response.headers['charset'] = "UTF-8"
    return response


@app.route("/download_original_data/", methods=["POST"])
def download_original_data():
    global current_response
    return_original_data()
    return current_response


@app.route("/cleanup_data/", methods=["GET", "POST"])
def cleanup():
    files = glob.glob(app.config['uploadFolder'] + "*")
    [os.remove(f) for f in files]
    return ""



@app.route("/get-na-original-graph/",methods=["GET","POST"])
def original_data_NA_graphs():
    labels = []
    na_values = []
    global original_data_frame

    for column in original_data_frame.columns.values.tolist():
        count = original_data_frame[column].isna().sum()
        if count > 0:
            na_values.append(count)
            labels.append(column)
    graph.bar_graph(labels, na_values, "image.png","Columns with NA values")
    file_name = "image.png"
    response = send_from_directory(directory=".", path=file_name, as_attachment=True)
    response.headers['Content-Disposition'] = 'attachment; filename="' + file_name + '"'
    response.headers['Content-Type'] = "application/octet-stream"
    response.headers['charset'] = "UTF-8"
    return response

@app.route("/get-na-graph/",methods=["GET","POST"])
def data_NA_graphs():
    labels = []
    na_values = []
    global data_frame

    for column in na_columns:
        if column in data_frame.columns.values.tolist():
            labels.append(column)
            na_values.append(data_frame[column].isna().sum())

    graph.bar_graph(labels, na_values, "image.png","Columns with NA values")
    file_name = "image.png"
    response = send_from_directory(directory=".", path=file_name, as_attachment=True)
    response.headers['Content-Disposition'] = 'attachment; filename="' + file_name + '"'
    response.headers['Content-Type'] = "application/octet-stream"
    response.headers['charset'] = "UTF-8"
    return response

@app.route("/get-hist-graph/<column_name>/<bins>",methods=["POST", "OPTIONS"])
def data_hist_graphs(column_name, bins):
    values = data_frame[column_name].tolist()
    bins = int(bins)
    graph.histograms(values, bins, "image.png",data_frame,column_name)
    file_name = "image.png"
    response = send_from_directory(directory=".", path=file_name, as_attachment=True)
    response.headers['Content-Disposition'] = 'attachment; filename="' + file_name + '"'
    response.headers['Content-Type'] = "application/octet-stream"
    response.headers['charset'] = "UTF-8"
    return response

@app.route("/get-categorical-graph/<column_name>",methods=["POST"])
def data_cat_graphs(column_name):
    counts = data_frame[column_name].value_counts()
    graph.bar_graph(counts.index.tolist(),counts.values,"image.png", column_name)
    file_name = "image.png"
    response = send_from_directory(directory=".", path=file_name, as_attachment=True)
    response.headers['Content-Disposition'] = 'attachment; filename="' + file_name + '"'
    response.headers['Content-Type'] = "application/octet-stream"
    response.headers['charset'] = "UTF-8"
    return response

@app.route("/get-categorical-pie-graph/<column_name>",methods=["POST"])
def data_pie_graphs(column_name):
    counts = data_frame[column_name].value_counts()
    graph.pie_graph(counts.index.tolist(),counts.values,"image.png",column_name)
    file_name = "image.png"
    response = send_from_directory(directory=".", path=file_name, as_attachment=True)
    response.headers['Content-Disposition'] = 'attachment; filename="' + file_name + '"'
    response.headers['Content-Type'] = "application/octet-stream"
    response.headers['charset'] = "UTF-8"
    return response

if __name__ == '__main__':
    app.run()
