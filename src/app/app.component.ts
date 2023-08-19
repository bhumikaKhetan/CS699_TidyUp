import { Component } from '@angular/core';
import { AppService } from './app.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})




export class AppComponent  {

  table = $('#table_id').DataTable();

  columnCount = 0
  RowCount = 0
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  // dtElement: DataTableDirective;
  title = 'CS699_APP';
  csvHeader: string[] = [];
  csvData: any[] = [];
  downloaded_data: any = {};
  image: any;

  tool_options: FormGroup = this.formBuilder.group({
    tool_type: "",
    col_name: "",
    old_val: "",
    new_val: ""
  });

  graph_options: FormGroup = this.formBuilder.group({
    graph_type: "",
    col_name: "",
    // new_val: "",
    col_2name:"",
  });

  trans_options: FormGroup = this.formBuilder.group({
    trans_type: "",
    col_name: "",

  });

  enable_cols = false;
  enable_old_val = false;
  enable_new_val = false;
  enable_Gcols = false;
  enable_Gval = false;
  enable_Tcols = false;
  enable_Gcols2 = false;

  constructor(private appservice: AppService, public formBuilder: FormBuilder, private sanitizer: DomSanitizer) { }


  ngOnInit() {
    // this.csvHeader = ["No data Yet"]
    // this.csvData=[["Nothing uploaded"]]
    this.dtOptions = {
      // bSort: false,
      pagingType: 'full_numbers',
      pageLength: 2
    };
    this.enable_cols = false;
    this.enable_old_val = false;
    this.enable_new_val = false;
    this.enable_Gcols = false;
    this.enable_Gval = false;

    this.appservice.clean_data().subscribe();

    
   
  }

  getDataCount(){
    this.columnCount = this.csvHeader.length
    this.RowCount = this.csvData.length

  }
  onTSubmit() {
    let trans_type = this.trans_options.value.trans_type;
    let col_name = this.trans_options.value.col_name;
    console.log("transtype: " , trans_type)
    if (trans_type == 'normalization') {
      console.log("In trans type");
      this.appservice.normalization(col_name).subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (trans_type == 'standardization') {
      this.appservice.standardization(col_name).subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (trans_type == 'drop_column') {
      this.appservice.drop_column(col_name).subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (trans_type == 'label_encoding') {
      this.appservice.label_encoding(col_name).subscribe(data => {
        this.getSubmitData();
      });
    }

  }
  onSubmit() {
    
    let tool_type = this.tool_options.value.tool_type;
    let col_name = this.tool_options.value.col_name;
    let old_val = this.tool_options.value.old_val;
    let new_val = this.tool_options.value.new_val;
    console.log("In submit")
    console.log(tool_type)
    if (tool_type == 'drop_na_cols') {
      console.log("drop_na_cols Inside")
      this.appservice.drop_na_cols().subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (tool_type == 'drop_na_col_name') {
      this.appservice.drop_na_cols_name(col_name).subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (tool_type == 'drop_na_row') {
      this.appservice.drop_na_rows().subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (tool_type == 'drop_na_row_name') {
      console.log("In drop na row name")
      this.appservice.drop_na_rows_name(col_name).subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (tool_type == 'replace_na') {
      this.appservice.replace_na_value(col_name, new_val).subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (tool_type == 'replace_val') {
      this.appservice.replace_val_value(col_name, old_val, new_val).subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (tool_type == 'bfill') {
      this.appservice.bfill().subscribe(data => {
        this.getSubmitData();
      });
    }
    else if (tool_type == 'ffill') {
      this.appservice.ffill().subscribe(data => {
        this.getSubmitData();
      });
    }
    
    
    // this.dtTrigger.next(null);
  }

// graph
onGSubmit() {
  let graph_type = this.graph_options.value.graph_type;
  let col_name = this.graph_options.value.col_name;
  // let new_val = this.graph_options.value.new_val;
  let col_2name= this.graph_options.value.col_2name;

  if (graph_type == 'categorical_pie_chart') {
    this.appservice.categorical_pie_chart(col_name).subscribe(response => {
      let blob: Blob = response.body as Blob;
      let objectURL = URL.createObjectURL(blob);       
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }
  else if (graph_type == 'bar_chart_na') {
    this.appservice.bar_chart_na().subscribe(response => {
      let blob: Blob = response.body as Blob;
      let objectURL = URL.createObjectURL(blob);       
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }
  else if (graph_type == 'bar_chart_na_original') {
    this.appservice.bar_chart_na_original().subscribe(response => {
      let blob: Blob = response.body as Blob;
      let objectURL = URL.createObjectURL(blob);       
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }
  else if (graph_type == 'hist_chart') {
    this.appservice.hist_chart(col_name).subscribe(response => {
      let blob: Blob = response.body as Blob;
      let objectURL = URL.createObjectURL(blob);       
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }
  else if (graph_type == 'categorical_data') {
    this.appservice.categorical_data(col_name).subscribe(response => {
      let blob: Blob = response.body as Blob;
      let objectURL = URL.createObjectURL(blob);
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }

  else if (graph_type == 'line_chart') {
    console.log(col_name)
    console.log(col_2name)
    this.appservice.line_chart(col_name, col_2name).subscribe(response => {
      let blob: Blob = response.body as Blob;
      let objectURL = URL.createObjectURL(blob);
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    });
  }
}

onTOptionsSelected(event?: any) {
  console.log(event.target.value);
  let select_value = event.target.value;
  if (select_value == 'select') {
    this.enable_Tcols = false;

  }
  else if (select_value == 'normalization') {
    this.enable_Tcols = true;

  }
  else if (select_value == 'standardization') {
    this.enable_Tcols = true;

  }
  else if (select_value == 'drop_column') {
    this.enable_Tcols = true;

  }
  else if (select_value == 'label_encoding') {
    //ask
    this.enable_Tcols = true;

  }
}

getSubmitData() {
    this.appservice.getUpdatedFile().subscribe(data => {
      console.log(data)
      const list = data.split('\n');
      this.csvHeader = list[0].split(",");
    
      console.log(this.csvHeader);
      list.shift()
      this.csvData = [];
      list.forEach(l => {
        if(l == null || l == ""){

        }
        else{
          this.csvData.push(l.split(","));
        }        
      });
      this.getDataCount()
    });
    console.log("printing")
    console.log(this.csvData)
    
    
  }


  getData() {
      this.appservice.getCSVFile().subscribe(data => {
        const list = data.split('\n');
        this.csvHeader = list[0].split(",");
        console.log("Header length ",this.csvHeader.length)

        // console.log("Hiii data")
        // console.log(this.csvHeader);
        this.csvData = [];
        list.shift()
        list.forEach(e => {
          if(e == null || e == ""){

          }
          else{
            this.csvData.push(e.split(","));
          }
          
        });
        this.getDataCount()
      });

      console.log("please find data")
      console.log(this.csvData);
      this.getDataCount()
     

      
    }


  
  uploadFile(event?: any) {

    this.appservice.clean_data().subscribe(data => {
      this.uploadFileActual(event)

    });
    
  }

  uploadFileActual(event?:any){
    const file: File = event.target.files[0];
    if(!file.name.endsWith(".csv")){
      console.warn("Wrong file format. Currently support only for csv files")
      alert("Wrong file format. Currently support only for csv files" );
    }
    if (file) {
      const formData = new FormData();
      formData.append("file_data", file);
      this.appservice.submitForm(formData).subscribe(response =>{
        this.getData();

        // $('#table_id').DataTable().destroy();
        // this.dtTrigger.next(null);

      }
      );
    }
  }


  submitChange(event?: any) {
      this.getSubmitData()
      this.dtTrigger.next(null);
  }


  onOptionsSelected(event?: any) {
    console.log(event.target.value);
    let select_value = event.target.value;
    if (select_value == 'select') {
      this.enable_cols = false;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
    else if (select_value == 'drop_na_cols') {
      console.log("In option selected drop na cols")
      this.enable_cols = false;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
    else if (select_value == 'drop_na_col_name') {
      this.enable_cols = true;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
    else if (select_value == 'drop_na_row') {
      this.enable_cols = false;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
    else if (select_value == 'drop_na_row_name') {
      //ask
      this.enable_cols = true;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
    else if (select_value == 'replace_na') {
      this.enable_cols = true;
      this.enable_new_val = true;
      this.enable_old_val = false;
    }
    else if (select_value == 'replace_val') {
      this.enable_cols = true;
      this.enable_new_val = true;
      this.enable_old_val = true;
    }
    else if (select_value == 'bfill') {
      this.enable_cols = false;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
    else if (select_value == 'ffill') {
      this.enable_cols = false;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
    else {
      this.enable_cols = false;
      this.enable_new_val = false;
      this.enable_old_val = false;
    }
  }

// graphs
onGOptionsSelected(event?: any) {
  console.log(event.target.value);
  let select_value = event.target.value;
  if (select_value == 'select') {
    this.enable_Gcols = false;
    // this.enable_Gval = false;
    this.enable_Gcols2=false;

    
  }
  else if (select_value == 'categorical_pie_chart') {
    this.enable_Gcols = true;
    // this.enable_Gval = false;
    this.enable_Gcols2=false;

    
  }
  else if (select_value == 'bar_chart_na') {
    this.enable_Gcols = false;
    // this.enable_Gval = false;
    this.enable_Gcols2=false;

    
  }
  else if (select_value == 'bar_chart_na_original') {
    this.enable_Gcols = false;
    // this.enable_Gval = false;
    this.enable_Gcols2=false;

    
  }
  else if (select_value == 'hist_chart') {
    this.enable_Gcols = true;
    // this.enable_Gval = true;
    this.enable_Gcols2=false;

    
  }
  else if (select_value == 'line_chart') {
    this.enable_Gcols = true;
    // this.enable_Gval = false;
    this.enable_Gcols2=true;


  }
  else if (select_value == 'categorical_data') {
    this.enable_Gcols = true;
    // this.enable_Gval = false;
    this.enable_Gcols2=false;


  }
  
}


  resetData() {
    this.appservice.reset_data().subscribe(data => {
      console.log(data)
      const list = data.split('\n');
      this.csvHeader = list[0].split(",");
      console.log(this.csvHeader);
      list.shift()
      this.csvData = [];
      list.forEach(l => {
        if(l == null || l == ""){

        }
        else{
          this.csvData.push(l.split(","));
        }
      });
      this.getDataCount()
    });
    // console.log("printing")
    
    console.log(this.csvData)
  }

  downloadUpdatedData() {
    this.appservice.downloadUpdatedFile().subscribe(response => {
      // console.log(response.headers.get('Content-Disposition'));
      // let file_name = response.headers.get('Content-Disposition')?.split(';')[1].split('=')[1];
      // console.log(file_name);
      let blob: Blob = response.body as Blob;
      let a = document.createElement('a');
      a.download = "data.csv";
      a.href = window.URL.createObjectURL(blob);
      a.click();
    });
  }

  downloadFile() {
    this.appservice.downloadOriginalFile().subscribe(response => {
      // console.log(response.headers.get('Content-Disposition'));
      // let file_name = response.headers.get('Content-Disposition')?.split(';')[1].split('=')[1];
      // console.log(file_name);
      let blob: Blob = response.body as Blob;
      let a = document.createElement('a');
      a.download = "data.csv";
      a.href = window.URL.createObjectURL(blob);
      a.click();
      var FileSaver = require('file-saver');
      FileSaver.saveAs(blob, "/data_text.csv");
    });
  }


}
