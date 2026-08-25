import { Component, OnInit } from '@angular/core';
import {FormGroup , FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from 'src/app/model/student.model';
import { StudentService } from 'src/app/service/student.service';
@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  regionalCouncils: string[];
  educationStandard:string[];
  priorCounceling: string[];
  queryCategory: string[];
  showCouncelingBox: boolean = false;
  educationStatus: string[];
  student: Student;
  msg: string;

  constructor(private studentService: StudentService,
    private router: Router) { }

  ngOnInit(): void {
    this.regionalCouncils=[
      'Central Northern Eastern India (CNEI)',
      'Northern Eastern Gujrat (NEG)',
      'Northern Saurashtra (NS)',
      'Southern India (SI)',
      'Souther Saurashtra (SS)',
      'Western India (WI)'
    ];

      this.educationStandard=[
        'No formal education',
        'Standard 8th',
        'Standard 9th',
        'Standard 10th',
        'Standard 11th',
        'Standard 12th',
        'Diploma / Certificate / Vocational Course',
        'First year of Bachelor\'s Degree',
        'Second year of Bachelor\'s Degree',
        'Third year of Bachelor\'s Degree',
        'Fourth year of Bachelor\'s Degree',
        'Graduate (Bachelors Degree)',
        'Post Graduate (Master\'s Degree)',
        'Professional Degree (CA, MBBS, CFA, etc.)',
        'PhD'
      ];

      this.priorCounceling=[
        'No',
        'Yes - RISE Counseling',
        'Yes - Career Counseling from other source'
      ];

      this.queryCategory=[
        'Watch Party',
        'Study in India - Courses Information',
        'Study in India - Colleges Information',
        'Study in India - Scholarships Information',
        'Study in India - Guidance',
        'Study Abroad - Courses Information',
        'Study Abroad - Colleges Information',
        'Study Abroad - Scholarships Information',
        'Study Abroad - Guidance',
        'Distance or Online Courses Information',
        'Need Career Counselling',
        'Need Subject Matter Expert Guidance',
        'Education Board Program related',
        'Education Loans / Financial Products'
      ];
      this.educationStatus=[
        'Currently Studying',
        'Completed',
        'Dropped out'
      ]
    this.studentForm = new FormGroup({
      full_name: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z ]+$/)]),
        phone_num: new FormControl('',[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
        email_id: new FormControl('',[Validators.required,Validators.email]),
        date_of_birth: new FormControl('',Validators.required),
        regional_council: new FormControl('',Validators.required),
        local_council: new FormControl(''),
        jamatkhana: new FormControl(''),
        state: new FormControl(''),
        city: new FormControl(''),
        education_standard: new FormControl('',Validators.required),
        education_status: new FormControl('' ),
        prior_counseling_done: new FormControl(''),
        career_counseling_report: new FormControl(''),
        query_category: new FormControl('',Validators.required),
        career_query: new FormControl('',Validators.required),
    });
  }

  onFormSubmit(){

    this.student = this.studentForm.value;
    this.studentService.postStudent(this.student)
    .subscribe({
      next: (data)=>{
       let leadId= data.lead_ids[0];
       this.studentService.assignLead(leadId, this.student.regional_council)
       .subscribe({
        next: (data) => {

        },
        error: (err)=>{
          this.msg='Could not process request at this time, please try again';
        }
       })
       this.router.navigateByUrl('/confirmation/' + this.student.full_name);
      },
      error: (err)=>{
          this.msg='Could not process request at this time, please try again';
      }
    });
  }

  onCouncelingSelect(){
    if(this.studentForm.value.prior_counseling_done !== 'No'){
        this.showCouncelingBox = true;
    }
    else
      this.showCouncelingBox = false;
  }
}
