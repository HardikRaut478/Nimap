import { HttpClient } from '@angular/common/http';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {



  constructor(private fb:FormBuilder, public dialogRef: MatDialogRef<RegisterComponent>, private http:HttpClient,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public matData: any){}
  ngOnInit(): void {
    if(this.matData){
      this.getById(this.matData)
      this.edit=false
    }


  }

  edit=true;

  registerForm = this.fb.group({
    firstName:['',[Validators.required,Validators.pattern("^[a-zA-Z]+$")]],
    lastName:['',[Validators.required,Validators.pattern("^[a-zA-Z]+$")]],
    mail:['',[Validators.required,Validators.email]],
    mobile:['',[Validators.required]],
    age:[20],
    state:['',[Validators.required]],
    country:['',[Validators.required]],
    address:['',[Validators.required]],
    tags:[''],
    isSubscribe:[''],
    profileImage: [''],
  })

  getById(id:number|string){
    this.http.get('http://localhost:3000/profile/'+id).subscribe({
      next:(res)=>{
        this.registerForm.patchValue(res)
      }
    })
  }

  submit(){
    if(this.matData){
      this.http.put('http://localhost:3000/profile/'+this.matData,this.registerForm.value).subscribe((res)=>{
        console.log(res);
        this.edit=false
        
      })
    }else{
      this.http.post('http://localhost:3000/profile',this.registerForm.value).subscribe((res)=>{
        console.log(res);
        this.edit=false

      })
    }


    // this.dialogRef.close(this.registerForm.value)

  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files.');
        return;
      }
      debugger
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        console.log(base64);
        this.registerForm.patchValue({
          profileImage:base64
        })
        
      };
      reader.readAsDataURL(file);
    }
  }

}
