import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { Student } from "../model/student.model";

@Injectable({
  providedIn: 'root'
})
export class StudentService{

  constructor(private http: HttpClient){}

  public postStudent(student: Student) : Observable<any>{

    //Base64 Encoded username:authtoken 
    //username is career.helpdesk@djtrust.org
    //authtoken can be generated using https://api.metroleads.com/auth/issue_token?username=xxx&password=xxx
    // let header = {
    //   'Authorization' : 'Basic Y2FyZWVyLmhlbHBkZXNrQGRqdHJ1c3Qub3JnOmI3MzQxMTY4LTJlZTktNDg0YS1iMDIzLTgzNWFlYjRiZTZlNA=='
    // }

    import { AUTH_HEADER_VALUE } from '../../config/authConfig';

    if (!AUTH_HEADER_VALUE) {
      throw new Error('AUTH_HEADER_VALUE is missing from authConfig — check the last rotation run.');
    }
    
    let header = {
      'Authorization': `Basic ${AUTH_HEADER_VALUE}`
    }

     let payload = {
      "email": student.email_id,
      "name": student.full_name,
      "phone": student.phone_num,
      "source_tags": [
        "Career Helpdesk"
      ],
      "lead_fields": {
        "dob_b7a": [
        student.date_of_birth
        ],
      "regional_council_b8e": [
        student.regional_council
        ],
      "local_council_6e4": [
           student.local_council
         ],
      "jamatkhana_3e2": [
         student.jamatkhana
         ],
      "state_ce7": [
        student.state
         ],
      "city_45d":[
         student.city
        ],
      "education_status_e30": [
         student.education_status
        ],
      "qualification_50a": [
         student.education_standard
        ],
      "prior_career_counselling_c5a":  [student.prior_counseling_done],
       "prior_counselling_details_a0f": [
           student.career_counseling_report
       ],
      "query_category_2db": [
         student.query_category
        ],
      "career_query_fba": [
        student.career_query
        ]
      }
    }
    // return this.http.post<any>(environment.serverUrl + 'api/student/add',student);
    return this.http.post<any>('https://api.metroleads.com/companies/c50bd80c-330e-410f-8c02-5d91638ca30d/leads/upsert',payload, {headers: header});

  }

  public assignLead(leadId: any, regional_council: string) {
    let header = {
      'Authorization' : 'Basic Y2FyZWVyLmhlbHBkZXNrQGRqdHJ1c3Qub3JnOjU1NTdiNzI2LWQwZDMtNGE2NS05NDUxLWJhN2EwMTE3MzAzYQ=='
    }
    let payload = {};
    switch(regional_council){
      case 'Central Northern Eastern India (CNEI)':
        payload = {"to_user_email":"cnei.helpdesk21@gmail.com"}
        break;
      case 'Northern Eastern Gujrat (NEG)':
        payload = {"to_user_email":"neg.helpdesk21@gmail.com"}
        break;
      case 'Northern Saurashtra (NS)':
        payload = {"to_user_email":"ns.helpdesk21@gmail.com"}
        break;
      case 'Southern India (SI)':
        payload = {"to_user_email":"si.helpdesk21@gmail.com"}
        break;
      case 'Souther Saurashtra (SS)':
        payload = {"to_user_email":"ss.helpdesk21@gmail.com"}
        break;
      case 'Western India (WI)':
        payload = {"to_user_email":"wi.helpdesk21@gmail.com"}
        break;
    }

    return this.http.post<any>('https://api.metroleads.com/companies/c50bd80c-330e-410f-8c02-5d91638ca30d/leads/' + leadId +  '/assign',payload, {headers: header});
  }
}
