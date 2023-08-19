import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  csv_data_path = '/assets/data_test.csv';

  upload_data_path = 'http://127.0.0.1:5000/upload-data';
  
  download_orig_data_path = "http://127.0.0.1:5000/reset-data/";

  download_updated_data_path = "http://127.0.0.1:5000/download_updated_data/";

  get_updated_data_path = "http://127.0.0.1:5000/get_updated_data/";

  reset_data_path = "http://127.0.0.1:5000/reset-data/";

  drop_na_cols_path = "http://127.0.0.1:5000/drop_NA_columns/";

  drop_na_cols_name_path = "http://127.0.0.1:5000/drop_NA_columns/"

  drop_na_rows_path = "http://127.0.0.1:5000/drop_NA_rows/";

  drop_na_rows_name_path = "http://127.0.0.1:5000/drop_NA_rows/";

  replace_na_value_path = "http://127.0.0.1:5000/replace-na-data/";

  bfill_path = "http://127.0.0.1:5000/replace-na-bfill/";

  ffill_path = "http://127.0.0.1:5000/replace-na-ffill/";

  replace_val_value_path = "http://127.0.0.1:5000/replace-data/";

  clean_data_path = "http://127.0.0.1:5000/cleanup_data";

  get_col_list_path = "http://127.0.0.1:5000/get-columns-list/";

  get_categorical_chart_path = "http://127.0.0.1:5000/get-categorical-pie-graph/";
  get_bar_chart_na_path = "http://127.0.0.1:5000/get-na-graph/";
  get_bar_chart_na_orig_path = "http://127.0.0.1:5000/get-na-original-graph/";
  get_hist_chart_path = "http://127.0.0.1:5000/get-hist-graph/";

  get_line_chart_path="http://127.0.0.1:5000/get-line-graph/";
  get_categorical_data_path="http://127.0.0.1:5000/get-categorical-graph/";

  normalization_path ="http://127.0.0.1:5000/normalization/";

  standardization_path="http://127.0.0.1:5000/standardization/";

  label_encoding_path="http://127.0.0.1:5000/label_encoding/";

  drop_column_path="http://127.0.0.1:5000/delete_column/";




  constructor(private http: HttpClient) { }

  drop_na_cols() {
    console.log("Inside na columns")
    return this.http.post(this.drop_na_cols_path, {});
  }

  drop_na_cols_name(name: string){
    return this.http.get(this.drop_na_cols_name_path+name);
  }

  drop_na_rows(){
    return this.http.post(this.drop_na_rows_path, {});
  }

  drop_na_rows_name(name: string){
    return this.http.post(this.drop_na_rows_name_path+name,{});
  }

  replace_na_value(name: string, value: string){
    return this.http.post(this.replace_na_value_path+name+"/"+value+"/", {})
  }

  bfill(){
    return this.http.post(this.bfill_path, {});
  }

  ffill(){
    return this.http.post(this.ffill_path, {});
  }

  replace_val_value(col_name: string, old_val: string, new_val: string){
    return this.http.post(this.replace_val_value_path+col_name+"/"+old_val+"/"+new_val, {});
  }

  clean_data(){
    return this.http.post(this.clean_data_path, {});
  }
  reset_data(){
    return this.http.post(this.reset_data_path, {},  { responseType: 'text'});
  }

  downloadOriginalFile(): Observable<any> {
    return this.http.post(this.download_orig_data_path, {},  { responseType: 'blob', observe: 'response'});
  }

  downloadUpdatedFile(): Observable<any> {
    return this.http.post(this.download_updated_data_path, {},  { responseType: 'blob', observe: 'response'});
  }

  getUpdatedFile() {
    return this.http.post(this.get_updated_data_path, {},  { responseType: 'text'});
  }

  getCSVFile() {
    return this.http.post(this.download_updated_data_path, {},  { responseType: 'text'});
  }

  submitForm(formData:any) {
    return this.http.post(this.upload_data_path, formData);
  }

// graphs

categorical_pie_chart(name: string){
  return this.http.post(this.  get_categorical_chart_path+name, {},  { responseType: 'blob', observe: 'response'});
}
bar_chart_na(){
  return this.http.post(this.get_bar_chart_na_path, {},  { responseType: 'blob', observe: 'response'});
}
bar_chart_na_original(){
  return this.http.post(this.get_bar_chart_na_orig_path, {},  { responseType: 'blob', observe: 'response'});
}
hist_chart(name: string){
  return this.http.post(this.get_hist_chart_path+name+"/0", {},  { responseType: 'blob', observe: 'response'});
}
categorical_data(name: string){
  return this.http.post(this.get_categorical_data_path+name, {},  { responseType: 'blob', observe: 'response'});

}
line_chart(name: string, name2: string){
  return this.http.post(this.get_line_chart_path+name+"/"+name2, {},  { responseType: 'blob', observe: 'response'});

}


normalization(name: string){
  return this.http.get(this.normalization_path+name);
}
standardization(name: string){
  return this.http.get(this.standardization_path+name);
}

drop_column(name: string){
  return this.http.get(this.drop_column_path+name);
}
label_encoding(name: string){
  return this.http.get(this.label_encoding_path+name);
}

}
