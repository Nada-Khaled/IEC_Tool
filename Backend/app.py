from calendar import c
from hashlib import new
import os
from io import BytesIO
from datetime import datetime, date, timedelta, timezone
from tkinter import N
from flask import Flask, request, Response, abort, jsonify, send_file, session, redirect, url_for, render_template,flash, send_from_directory
from idna import check_hyphen_ok
from sqlalchemy import null, or_, and_, not_, desc, true, update, select
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
import base64
import math
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from xlsxwriter import Workbook
import pandas as pd
from sqlalchemy.sql.elements import Null
from models import *
import re
import psycopg2

# def create_app(test_config=None):
# create and configure the app
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'xlsx'])

app = Flask(__name__)
app.secret_key = os.urandom(24)
setup_db(app)
# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET")  # Change this!
app.config['UPLOAD_FOLDER'] = os.path.abspath(os.getcwd())
#! I have changed this value in file:
#! C:\Users\Nada\AppData\Local\Programs\Python\Python310\Lib\site-packages\flask_sqlalchemy\__init__.py
#! OR I can just edit it in my environment folder in file:
#! D:\Orange\IEC\IEC_Tool\Backend\iecenv\Lib\site-packages\flask_sqlalchemy\__init__.py
#! from:
#track_modifications = app.config.setdefault(
        #     'SQLALCHEMY_TRACK_MODIFICATIONS', None
        # )
#! to:
#track_modifications = app.config.setdefault(
        #     'SQLALCHEMY_TRACK_MODIFICATIONS', False
        # )

jwt = JWTManager(app)


'''
@TODO: Set up CORS. Allow '*' for origins. Delete the sample route after completing the TODOs
'''
cors = CORS(app, resources={r"/api-iec/*": {"origins": "*"}})

'''
@TODO: Use the after_request decorator to set Access-Control-Allow
'''

# CORS Headers 
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
    return response

def check_username(usern):
    message_dict = {
        "is_valid": True,
        "message": ''
    }
    if (len(usern) < 6 or len(usern) > 30):
        message_dict['message'] = message_dict['message'] + "username's length should be between 6 to 30 characters"
        message_dict['is_valid'] = False      
    return message_dict


def check_password(passwd):
    SpecialSym =['$', '@', '#', '%', '!', '^', '&', '*']
    message_dict = {
        "is_valid": True,
        "message": ''
    }
    
    if len(passwd) < 8:
        message_dict['message'] = message_dict['message'] + "Password's length should be at least 8 \n"
        message_dict['is_valid'] = False      
    if len(passwd) > 20:
        message_dict['message'] = message_dict['message'] + "Password's length should be not be greater than 20 \n"
        message_dict['is_valid'] = False
    if not any(char.isdigit() for char in passwd):
        message_dict['message'] = message_dict['message'] + 'Password should have at least one numeral \n'
        message_dict['is_valid'] = False
    if not any(char.isupper() for char in passwd):
        message_dict['message'] = message_dict['message'] + 'Password should have at least one uppercase letter \n'
        message_dict['is_valid'] = False
    if not any(char.islower() for char in passwd):
        message_dict['message'] = message_dict['message'] + 'Password should have at least one lowercase letter \n'
        message_dict['is_valid'] = False        
    if not any(char in SpecialSym for char in passwd):
        message_dict['message'] = message_dict['message'] + 'Password should have at least one of the symbols $ @ # % ! ^ & * \n'
        message_dict['is_valid'] = False
    return message_dict

def check_email(email):
    # Make a regular expression
    # for validating an Email
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    
    # pass the regular expression
    # and the string into the fullmatch() method
    if(re.fullmatch(regex, email)):
        message_dict = {
            "is_valid": True,
            "message": ''
        }
    else:
        message_dict = {
            "is_valid": False,
            "message": 'Email is invalid'
        }
    return message_dict

def isBlank(somestring):
    try:
        float(somestring)
        if math.isnan(somestring):
          return True
        else:
          return False
    except ValueError:
        return not bool(str(somestring) and not str(somestring).isspace())


# def handleImportIECExcel(file, user_id):
def handleImportIECExcel(file, iec_attachment_name):

    print("\n\n In handle Import Excel, received file is:")
    print(type(file))
    print(file)
    # df = pd.read_excel(file, sheet_name='Sites')
    df = pd.read_excel(file)
    output_file = df
    output_file['Tool Status'] = ""
    for index, row in df.iterrows():
      try:
        
        if(isBlank(row['Project Title'])):
            output_file.at[index, 'Tool Status'] = "Empty IEC Title"
            continue
        iecTitle = str(row['Project Title']).strip()
        # iecTitle = iecTitle.replace(" ", "")

        if isBlank(row['Project Description']):
            output_file.at[index, 'Tool Status'] = "Empty IEC Description"
            continue
        iecDescription = str(row['Project Description']).strip()
        # iecDescription = iecDescription.replace(" ", "")

        if(isBlank(row['Justification'])):
            output_file.at[index, 'Tool Status'] = "Empty IEC Justification"
            continue

        if(row['Request Date'] is None or row['Request Date'] == ''):
            output_file.at[index, 'Tool Status'] = "Empty IEC Request Date"
            continue
        
        if(isBlank(row['Comment'])):
            output_file.at[index, 'Tool Status'] = "Empty IEC Comment"
            continue

        if(isBlank(row['Finance Number'])):
            output_file.at[index, 'Tool Status'] = "Empty IEC Finance Number"
            continue

        if(isBlank(row['Status'])):
            output_file.at[index, 'Tool Status'] = "Empty IEC Status"
            continue

        if(isBlank(row['Is Annual'])):
            output_file.at[index, 'Tool Status'] = "Empty IEC Is Annual"
            continue

        if(isBlank(row['Decision Support Feedback'])):
            output_file.at[index, 'Tool Status'] = "Empty Decision Support Feedback"
            continue

        if(isBlank(row['Procurement Feedback'])):
            output_file.at[index, 'Tool Status'] = "Empty Procurement Feedback"
            continue

        if(isBlank(row['Supply Chain Feedback'])):
            output_file.at[index, 'Tool Status'] = "Empty Supply Chain Feedback"
            continue

        itemDescription = ''
        if(isBlank(row['Item Description'])):
            output_file.at[index, 'Tool Status'] = "Empty Item Description"
            continue
        itemDescription = row['Item Description']

        if(isBlank(row['Item Foreign Currency'])):
            output_file.at[index, 'Tool Status'] = "Empty Item Foreign Currency"
            continue
        
        if(isBlank(row['Item Is CAPEX'])):
            output_file.at[index, 'Tool Status'] = "Empty Is CAPEX"
            continue

        if(isBlank(row['Item Is OPEX'])):
            output_file.at[index, 'Tool Status'] = "Empty Is OPEX"
            continue

        if(isBlank(row['Owner Name'])):
            output_file.at[index, 'Tool Status'] = "Empty Owner Name"
            continue

        if(isBlank(row['Product Type'])):
            output_file.at[index, 'Tool Status'] = "Empty Product Type"
            continue


        # Check if Currency already exists:
        check_currency_query = db.session.query(Foreign_Currency).filter(
            Foreign_Currency.name==row['Item Foreign Currency']).all()
        item_foreign_currency = ''
        if len(check_currency_query) != 0:
            item_foreign_currency = check_currency_query[0]
        else:
            item_foreign_currency = Foreign_Currency(
                name=row['Item Foreign Currency'])
            item_foreign_currency.insert()

        is_foreign = False
        if row['Item Foreign Currency'].lower() != 'EGP'.lower():
            is_foreign = True

        # Check if Decision Support already exists:
        check_feedback_query = db.session.query(Decision_Support_Feedback).filter(
            Decision_Support_Feedback.name==row['Decision Support Feedback']).all()
        ds_feedback = ''
        if len(check_feedback_query) != 0:
            ds_feedback = check_feedback_query[0]
        else:
            ds_feedback = Decision_Support_Feedback(
                name=row['Decision Support Feedback'])
            ds_feedback.insert()

        # Check if Supply Chain already exists:
        check_feedback_query = db.session.query(Supply_Chain_Feedback).filter(
            Supply_Chain_Feedback.name==row['Supply Chain Feedback']).all()
        sc_feedback = ''
        if len(check_feedback_query) != 0:
            sc_feedback = check_feedback_query[0]
        else:
            sc_feedback = Supply_Chain_Feedback(
                name=row['Supply Chain Feedback'])
            sc_feedback.insert()    

        # Check if Procurement already exists:
        check_feedback_query = db.session.query(Procurement_Feedback).filter(
            Procurement_Feedback.name==row['Procurement Feedback']).all()
        pr_feedback = ''
        if len(check_feedback_query) != 0:
            pr_feedback = check_feedback_query[0]
        else:
            pr_feedback = Procurement_Feedback(
                name=row['Procurement Feedback'])
            pr_feedback.insert()
        
        # Check if Product Type already exists:
        check_product_type_query = db.session.query(Product_Type).filter(
            Product_Type.name == row['Product Type']).all()
        product_type = ''
        if len(check_product_type_query) != 0:
            product_type = check_product_type_query[0]
        else:
            product_type = Product_Type(
                name=row['Product Type'])
            product_type.insert() 
        
        
        # Check if Status already exists:
        check_status_query = db.session.query(Status).filter(
            Status.name == row['Status']).all()
        status = ''
        if len(check_status_query) != 0:
            status = check_status_query[0]
        else:
            status = Status(name=row['Status'])
            status.insert()
        
        
        # Check if Status already exists:
        check_owner_query = db.session.query(Owner).filter(
            Owner.name == row['Owner Name']).all()
        
        #! Didn't handle if it's a new owner cause the file doesn't include their department info
        owner = check_owner_query[0]
        
        # owner = ''
        # if len(check_owner_query) != 0:
        #     owner = check_owner_query[0]
        # else:
        #     owner = Owner(name=row['Owner Name'])
        #     owner.insert()
        
        is_annual = False
        if row['Is Annual'] == True:# or row['Is Annual'].lower() == 'Yes'.lower():
            is_annual = True
       
        item_is_capex = False
        if row['Item Is CAPEX'] == True:# or row['Item Is CAPEX'].lower() == 'Yes'.lower():
            item_is_capex = True
       
        item_is_opex = False
        if row['Item Is OPEX'] == True:# or row['Item Is OPEX'].lower() == 'Yes'.lower():
            item_is_opex = True
       
        need_reAllocation_PR = False
        if row['Need Re-allocation PR'] == True:# or row['Need Re-allocation PR'].lower() == 'Yes'.lower():
            need_reAllocation_PR = True
       
        need_reAllocation_PO = False
        if row['Need Re-allocation PO'] == True:# or row['Need Re-allocation PO'].lower() == 'Yes'.lower():
            need_reAllocation_PO = True
        
        # Check if the IEC already exist:
        check_iec_query = db.session.query(IEC).filter(
            IEC.active == True, IEC.project_title == iecTitle).all()

        current_iec=''
        if len(check_iec_query) != 0:  # ! should EDIT its values
            current_iec = check_iec_query[0]
        # New IEC
        else:
            current_iec = IEC(project_title=iecTitle, project_description=iecDescription,
            justification=row['Justification'],request_date=row['Request Date'],
            comment=row['Comment'],attachment_name=None,finance_number=int(row['Finance Number']),
            status=status,supply_chain_feedback=sc_feedback,
            procurement_feedback=pr_feedback,decision_support_feedback=ds_feedback,
            is_annual=is_annual,number_of_years=int(row['Number of Years']))

            current_iec.insert()
            print('\n\n\n>>>ADDED NEW IEC')
       
        # Check if the IEC item already exist:
        check_iec_item_query = db.session.query(IEC_Dep_Type).filter(
            IEC_Dep_Type.active == True, IEC_Dep_Type.description == itemDescription,
            IEC_Dep_Type.iec_id == current_iec.id).all()

        new_item = ''
        if len(check_iec_item_query) != 0: #! should EDIT its values
            new_item = check_iec_item_query[0]
        # New IEC Item
        else:
            new_item = IEC_Dep_Type(item_description=row['Item Description'],iec=current_iec,
                        is_foreign_currency=is_foreign,is_capex=item_is_capex,is_opex=item_is_opex,
                        owner=owner,product_type=product_type,
                        foreign_currency=item_foreign_currency,
                        need_realocation_PR=need_reAllocation_PR,need_realocation_PO=need_reAllocation_PO,)

            new_item.insert()
            print('\n\n\n****ADDED NEW IEC ITEM')



      except ValueError:
        print('\nexcept:')
        print(ValueError)
        print('----------')

    dflist = [output_file]
    '''
    Excelwriter = pd.ExcelWriter("Site Addition Result.xlsx",engine="xlsxwriter")
    for i, df in enumerate (dflist):
        df.to_excel(Excelwriter, sheet_name="Sites" + str(i+1),index=False)
    '''
    buffer = BytesIO()
    for i, df in enumerate(dflist):
        df.to_excel(buffer)
    return buffer
    '''
    xf = Excelwriter.save()
    template_qr = db.session.query(Template).get(1)
    if(template_qr is not None):
        template_qr.sites_file_last = xf
        template_qr.update()
    return dflist
    '''

# DONE
def handleExportAllIECsExcel():

    print("in export excel")
        
    #df = pd.read_excel(file, sheet_name='Sites') 
    output_file = pd.DataFrame(columns=['Project Title','Project Description','Justification','Request Date','IEC Date','Start Date','Finance Number','Comment','Supply Chain Feedback','Supply Chain Feedback Detailed','Decision Support Feedback','Decision Support Feedback detailed','Procurement Feedback','Procurement Feedback Detailed','CAPEX EGP','OPEX EGP' ,'Status','Is Annual','Number of Years','Item Description','Item Foreign Currency','Item Is CAPEX','Item CAPEX EGP','Item Is OPEX','Item OPEX EGP','Owner Name','Product Type','Need Re-allocation PR','Need Re-allocation PO'])

    # site_proj_qr = db.session.query(Site_Project).join(Site).filter(Site_Project.active == True).order_by(Site.id, Site_Project.id).all()
    all_ices_query = db.session.query(IEC).filter(IEC.active == True).order_by(IEC.id).all()

    for i in range(0,len(all_ices_query)):
        output_file.at[i,'Project Title'] = all_ices_query[i].project_title
        output_file.at[i,'Project Description']= all_ices_query[i].project_description
        output_file.at[i,'Justification'] = all_ices_query[i].justification
        output_file.at[i,'Request Date'] = all_ices_query[i].request_date
        output_file.at[i,'IEC Date']= all_ices_query[i].iec_date
        output_file.at[i,'Start Date'] = all_ices_query[i].start_date
        output_file.at[i,'Finance Number'] = 'TECH_' + str(all_ices_query[i].finance_number)
        output_file.at[i,'Comment'] = all_ices_query[i].comment
        output_file.at[i,'Supply Chain Feedback'] = all_ices_query[i].supply_chain_feedback.name
        output_file.at[i,'Supply Chain Feedback Detailed'] = all_ices_query[i].supply_chain_feedback_detailed
        output_file.at[i,'Decision Support Feedback']= all_ices_query[i].decision_support_feedback.name
        output_file.at[i,'Decision Support Feedback Detailed'] = all_ices_query[i].decision_support_feedback_detailed
        output_file.at[i,'Procurement Feedback']= all_ices_query[i].procurement_feedback.name
        output_file.at[i,'Procurement Feedback Detailed'] = all_ices_query[i].procurement_feedback_detailed
        output_file.at[i,'CAPEX EGP'] = all_ices_query[i].capex_egp
        output_file.at[i,'OPEX EGP'] = all_ices_query[i].opex_egp
        output_file.at[i,'Status'] = all_ices_query[i].status.name
        output_file.at[i,'Is Annual'] = "Yes" if all_ices_query[i].is_annual else "No"
        output_file.at[i,'Number of Years'] = all_ices_query[i].number_of_years
        
        ice_items_query = db.session.query(IEC_Dep_Type).filter(IEC_Dep_Type.iec_id == all_ices_query[i].id).order_by(IEC_Dep_Type.iec_id).all()
        for x in range(0,len(ice_items_query)):
            output_file.at[i,'Item Description'] = ice_items_query[x].description 
            output_file.at[i,'Item Foreign Currency'] = ice_items_query[x].foreign_currency.name
            output_file.at[i,'Item Is CAPEX'] = ice_items_query[x].is_capex
            output_file.at[i,'Item CAPEX EGP'] = ice_items_query[x].capex_egp
            output_file.at[i, 'Item Is OPEX'] = "Yes" if ice_items_query[x].is_opex else "No"
            output_file.at[i,'Item OPEX EGP'] = ice_items_query[x].opex_egp
            output_file.at[i,'Owner Name'] = ice_items_query[x].owner.name
            output_file.at[i,'Product Type'] = ice_items_query[x].product_type.name
            output_file.at[i,'Need Re-allocation PR'] = ice_items_query[x].need_realocation_PR
            output_file.at[i,'Need Re-allocation PO'] = ice_items_query[x].need_realocation_PO
      
        # if site_proj_qr[i].sign_date is None:
        #   output_file.at[i,'Sign Date']= ''
        # else:
        #   #sign_date_frt = str(site_proj_qr[i].sign_date).split(' ')
        #   #output_file.at[i,'Sign Date']= sign_date_frt[0]
        #   output_file.at[i,'Sign Date'] = site_proj_qr[i].sign_date
    dflist = [output_file]
    buffer = BytesIO()
    for i, df in enumerate (dflist):
        df.to_excel(buffer)
    return buffer


@app.route('/api-iec/excel-iecs-addition/<path:attachment_name>', methods=['GET', 'POST'])
@jwt_required
@cross_origin()
def handleImportAndExportIECs(attachment_name):
    if request.method == 'POST':

        file1 = request.files['file']

        out = handleImportIECExcel(file=file1, iec_attachment_name=attachment_name)
        headers = {
            'Content-Disposition': 'attachment; filename=output.xlsx',
            # 'Content-type': 'application/vnd.ms-excel'
            'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        # return Response(out.getvalue(), mimetype='application/vnd.ms-excel', headers=headers)
        return Response(out.getvalue(), mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers=headers)
    
    # DONE
    elif (request.method == 'GET'):
        out = handleExportAllIECsExcel()
        # print("\n\nin GET request for exporting excel\n")
        headers = {
            'Content-Disposition': 'attachment; filename=output.xlsx',
            # 'Content-type': 'application/vnd.ms-excel'
            'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        # return Response(out.getvalue(), mimetype='application/vnd.ms-excel', headers=headers)
        return Response(out.getvalue(), mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers=headers)


@app.route('/api-iec/upload-iec-attachment/<int:iec_id>/<path:attachment_name>', methods=['GET', 'POST'])
@jwt_required
@cross_origin()
def handleEditIecAttachment(iec_id,attachment_name):

    if request.method == 'POST':

        file1 = request.files['file'].read()

        iec = db.session.query(IEC).filter(IEC.id==iec_id).first()
        print('type el iec.attachment before: ', type(iec.attachment))
        # iec.attachment = psycopg2.Binary(file1)
        iec.attachment = file1
        iec.attachment_mimetype = request.files['file'].mimetype
        iec.attachment_name = request.files['file'].name

        print('\n\n\nTest el edit el attachment file')
        print('type el received file: ', type(file1))
        print('type el iec.attachment after: ', type(iec.attachment))
        print('type el iec.attachment_mimetype after: ', type(iec.attachment_mimetype))
        # print('type el psycopg2.Binary(file1): ', type(psycopg2.Binary(file1)))
        print(iec.attachment)
        print('\n\n\n')

        iec.update()
        print('\n\n\nDONE editing el attachment file')

        return "Attachment saved", 200
    



# @app.route('/api-iec/download-iec-attachment/<int:iec_id>', methods=['GET', 'POST'])
# @jwt_required
# @cross_origin()
# def handleDownloadIecAttachment(iec_id):

#     if request.method == 'GET':
#         iec_query = db.session.query(IEC).filter(IEC.id==iec_id).first()
#         if iec_query.attachment_mimetype == None or iec_query.attachment_mimetype == '' or iec_query.attachment_mimetype == null:
#             return ''
#         # res = {
            
#         #     "iec_attachment_file": Response(base64.encodebytes(iec_query.attachment),mimetype=iec_query.attachment_mimetype), 
                       
#         #     "iec_attachment_name": iec_query.attachment_name
#         #     }
#         res = Response(base64.encodebytes(iec_query.attachment),mimetype=iec_query.attachment_mimetype)
#         return res

@app.route('/api-iec/download-iec-attachment/<int:iec_id>', methods=['GET', 'POST'])
@jwt_required
@cross_origin()
def handleDownloadIecAttachment(iec_id):

    if (request.method == 'GET'):
        iec = db.session.query(IEC).filter(IEC.id==iec_id).first()
        out = iec.attachment
        # print("\n\nin GET request for exporting excel\n")
        headers = {
            'Content-Disposition': 'attachment; filename=output.pptx',
            # 'Content-type': 'application/vnd.ms-excel'
            'Content-type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }
        # return Response(out.getvalue(), mimetype='application/vnd.ms-excel', headers=headers)
        return Response(out, mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation', headers=headers)





#! NOT USED
'''
@app.route("/api/downloadFiles/<path:file_name>", methods=['GET', 'POST'])
@cross_origin()
def get_file(file_name):

    # for filename in os.listdir(app.config['UPLOAD_FOLDER']):
    #     f = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    # # #     # checking if it is a file
    #     if os.path.isfile(f):
    #         os.remove(f)

    # print('\n\nin download files file_name is:')
    # print(file_name)

    return send_from_directory(app.config['UPLOAD_FOLDER'],
     filename=file_name, as_attachment=True)
    # return "Done"

#! NOT USED
@app.route("/api/uploadFiles/<path:file_name>", methods=['GET', 'POST'])
@cross_origin()
def upload_file(file_name):

    # for filename in os.listdir(app.config['UPLOAD_FOLDER']):
    #     f = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    # # #     # checking if it is a file
    #     if os.path.isfile(f):
    #         os.remove(f)

    # iec_attachment = request.files[file_name]
    iec_attachment = request.files['file']
    # print('\n\nin upload files iec_attachment is:')
    # print(iec_attachment)
    iec_attachment.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(iec_attachment.filename)))

    # print('\nuploaded el7')
    return "Attachment saved"
'''

'''
Token related APIs
'''
# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@app.route("/api-iec/logins", methods=["POST"])
@cross_origin()
def handle_logins():

    # print("\n**********IN LOGINs API**********\n")

    username = request.json.get("username", None)
    password = request.json.get("password", None)
    user_qr = db.session.query(User).filter(or_(User.username == username, User.email == username)).all()
    
    # print("\n\nuser_qr:")
    # print(user_qr)

    if len(user_qr) ==0:
        # print("len query = 0")
        abort (401) #un-authorized
    elif check_password_hash(user_qr[0].password, password) == False:  
        # print("check password hash false")
        abort (401) #un-authorized
    
    additional_claims = {
        "user_id": user_qr[0].id,
        "is_integration_engineer": user_qr[0].is_integration_engineer,
        "is_audit": user_qr[0].is_audit,
        "is_manager": user_qr[0].is_manager,
        "is_admin": user_qr[0].is_admin,
        "is_super_user": user_qr[0].is_super_user
    }
    
    # print("\n\nadditional_claims:")
    # print("user_id ", additional_claims["user_id"])
    # print("is_integration_engineer ", additional_claims["is_integration_engineer"])
    # print("is_audit ", additional_claims["is_audit"])
    # print("is_manager ", additional_claims["is_manager"])
    # print("is_admin ", additional_claims["is_admin"])
    # print("is_super_user ", additional_claims["is_super_user"])

    access_token = create_access_token(identity=username, user_claims=additional_claims, fresh=True)

    # print("in api/logins, access_token:")
    # print(access_token)

    # print("\nin api/logins, refresh_token:")
    # print(create_refresh_token(identity=username, user_claims=additional_claims))
    #print (jsonify(access_token=access_token))
    return jsonify({
    'access_token': access_token,
    'refresh_token': create_refresh_token(identity=username, user_claims=additional_claims)
    })

@app.route('/api-iec/refresh', methods=['POST'])
# @jwt_required(refresh=True)
@jwt_required
def refresh():
    user_qr = db.session.query(User).filter(User.username == get_jwt_identity()).all()
    additional_claims = {
        "user_id": user_qr[0].id,
        "is_integration_engineer": user_qr[0].is_integration_engineer,
        "is_audit": user_qr[0].is_audit,
        "is_manager": user_qr[0].is_manager,
        "is_admin": user_qr[0].is_admin,
        "is_super_user": user_qr[0].is_super_user
    }

    current_user = get_jwt_identity()
 
    ret = {
        'access_token': create_access_token(identity=current_user, user_claims=additional_claims)
    }

    # print("\n\nret:")
    # print(ret)


    return jsonify(ret), 200

'''
Users related APIs
'''

'''
User related APIs (general)
'''
@app.route('/api-iec/users', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_users():
    if request.method == 'POST':
        data = request.json
        error = False
        user_body ={}
        try:
            count = 0
            if  data['first_name']=='':
                count = count + 1 
            if  data['last_name']=='':
                count = count + 1
            
            username_check = check_username(data['username'])
            if(username_check['is_valid'] == False): 
                resp =  jsonify({'message': username_check['message']})
                resp.status_code = 401
                return resp
            
            password_check = check_password(data['password'])
            if(password_check['is_valid'] == False): 
                resp =  jsonify({'message': password_check['message']})
                resp.status_code = 401
                return resp
            
            email_check = check_email(data['email'])
            if(email_check['is_valid'] == False):
                resp =  jsonify({'message': email_check['message']})
                resp.status_code = 401
                return resp
            
            if (count==2):
                resp =  jsonify({'message':'Please enter your name to be able to sign up'})
                resp.status_code = 401
                return resp
            
            if(data['re_password']!=data['password']):
                resp =  jsonify({'message':'Please check your password re-enter to be able to sign up'})
                resp.status_code = 401
                return resp
            
            if(data['phone'] == ''):
                resp =  jsonify({'message':'Please enter your phone number to be able to sign up'})
                resp.status_code = 401
                return resp
            
            if (data['role'] == 'is_integration_engineer'):
                user_new_user = User(username = data['username'], orange_id = None, password = generate_password_hash(data['password']), 
                    first_name = data['first_name'], last_name = data['last_name'], title = data['title'], email = data['email'],
                    profile_picture= None, profile_picture_mimetype= None, phone = data['phone'],
                    is_integration_engineer = True, is_audit = False, is_manager=False, is_admin = False, is_super_user = False)
            elif (data['role'] == 'is_super_user'):
                user_new_user = User(username = data['username'], orange_id = None, password = generate_password_hash(data['password']), 
                    first_name = data['first_name'], last_name = data['last_name'], title = data['title'], email = data['email'],
                    profile_picture= None, profile_picture_mimetype= None, phone = data['phone'],
                    is_integration_engineer = False, is_audit = False, is_manager=False, is_admin = False, is_super_user = True)
            elif (data['role'] == 'is_audit'):
                user_new_user = User(username = data['username'], orange_id = None, password = generate_password_hash(data['password']), 
                    first_name = data['first_name'], last_name = data['last_name'], title = data['title'], email = data['email'],
                    profile_picture= None, profile_picture_mimetype= None, phone = data['phone'],
                    is_integration_engineer = False, is_audit = True, is_manager=False, is_admin = False, is_super_user = False)
            elif (data['role'] == 'is_manager'):
                user_new_user = User(username = data['username'], orange_id = None, password = generate_password_hash(data['password']), 
                    first_name = data['first_name'], last_name = data['last_name'], title = data['title'], email = data['email'],
                    profile_picture= None, profile_picture_mimetype= None, phone = data['phone'],
                    is_integration_engineer = False, is_audit = False, is_manager=True, is_admin = False, is_super_user = False)
            elif (data['role'] == 'is_admin'):
                user_new_user = User(username = data['username'], orange_id = None, password = generate_password_hash(data['password']), 
                    first_name = data['first_name'], last_name = data['last_name'], title = data['title'], email = data['email'],
                    profile_picture= None, profile_picture_mimetype= None, phone = data['phone'],
                    is_integration_engineer = False, is_audit = False, is_manager=False, is_admin = True, is_super_user = False)
                user_new_user.insert()
                user_body = {
                    'success': True, 
                    'user': user_new_user.format()
                }
        except ValueError:
            error = True
            #print(Insert_Error(ValueError))
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(user_body),201 #Created
    elif request.method == 'GET':
        u_list = []

        users_qr1= db.session.query(User).filter(User.active == True, User.is_integration_engineer == True).order_by(User.id).all()
        for s in users_qr1:
            u_list.append(s.format())
            
        users_qr2= db.session.query(User).filter(User.active == True, User.is_audit == True).order_by(User.id).all()
        for s in users_qr2:
            u_list.append(s.format())

        users_qr3= db.session.query(User).filter(User.active == True, User.is_manager == True).order_by(User.id).all()
        for s in users_qr3:
            u_list.append(s.format())

        users_qr4= db.session.query(User).filter(User.active == True, User.is_admin == True).order_by(User.id).all()
        for s in users_qr4:
            u_list.append(s.format())

        users_qr5= db.session.query(User).filter(User.active == True, User.is_super_user == True).order_by(User.id).all()
        for s in users_qr5:
            u_list.append(s.format())

        if len(u_list)==0:
            abort (404) #Not Found
        else:
            #print(u_list)
            users ={
                'success' : True,
                'users' : u_list
                }
            return jsonify(users),200 #Ok

'''
Users related APIs
'''
@app.route('/api-iec/users/<int:user_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_users_user_id(user_id):
    if request.method == 'POST':
        data = request.json
        error = False
        user_body ={}
        if (data['req_type'] == 'edit'):
            try:
                count = 0
                if  data['first_name']=='':
                    count = count + 1 
                if data['last_name']=='':
                    count = count + 1
                if (count==2):
                    resp =  jsonify({'message':'Please enter your name to be able to sign up'})
                    resp.status_code = 401
                    return resp
                
                email_check = check_email(data['email'])
                if(email_check['is_valid'] == False):
                    resp =  jsonify({'message': email_check['message']})
                    resp.status_code = 401
                    return resp
                
                if(data['phone'] == ''):
                    resp =  jsonify({'message':'Please enter your phone number to be able to sign up'})
                    resp.status_code = 401
                    return resp    
                
                user_edit = db.session.query(User).get(user_id)
                user_edit.first_name = data['first_name']
                user_edit.last_name = data['last_name']
                user_edit.orange_id = data['orange_id'] if data['orange_id'] != 0 else None
                user_edit.title = data['title']
                user_edit.phone = data['phone']
                user_edit.email = data['email']
                if (data['role'] == 'is_integration_engineer'):
                    user_edit.is_integration_engineer = True
                    user_edit.is_audit = False
                    user_edit.is_manager=False
                    user_edit.is_admin = False
                    user_edit.is_super_user = False
                elif (data['role'] == 'is_audit'):
                    user_edit.is_integration_engineer = False
                    user_edit.is_audit = True
                    user_edit.is_manager=False
                    user_edit.is_admin = False
                    user_edit.is_super_user = False
                elif (data['role'] == 'is_manager'):
                    user_edit.is_integration_engineer = False
                    user_edit.is_audit = False
                    user_edit.is_manager=True
                    user_edit.is_admin = False
                    user_edit.is_super_user = False
                elif (data['role'] == 'is_admin'):
                    user_edit.is_integration_engineer = False
                    user_edit.is_audit = False
                    user_edit.is_manager=False
                    user_edit.is_admin = True
                    user_edit.is_super_user = False
                elif (data['role'] == 'is_super_user'):
                    user_edit.is_integration_engineer = False
                    user_edit.is_audit = False
                    user_edit.is_manager=False
                    user_edit.is_admin = False
                    user_edit.is_super_user = True
                user_edit.update()
                user_body = {
                'success': True, 
                'student': user_edit.format()
                }
            except ValueError:
                error = True
                #print(Insert_Error(ValueError))
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(user_body),201 #updated
        elif (data['req_type'] == 'delete'):
            try:
                user_edit = db.session.query(User).get(user_id)
                user_edit.delete()
                user_body = {
                    'success': True
                }
            except ValueError:
                error = True
                #print(Insert_Error(ValueError))
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(user_body),201 #updated
        elif (data['req_type'] == 'deactivate'):
            try:
                user_edit = db.session.query(User).get(user_id)
                user_edit.active = False
                user_edit.update()
                user_body = {
                    'success': True, 
                    'student': user_edit.format()
                }
            except ValueError:
                error = True
                #print(Insert_Error(ValueError))
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(user_body),201 #updated
    elif request.method == 'GET':
        user_qr = db.session.query(User).get(user_id)
        if (user_qr == None):
            abort (404) #Not Found
        else:
            user_dict = user_qr.format()
            user ={
                    'success' : True,
                    'user' : user_dict
                    }
            return jsonify(user),200 #Ok

'''
Profile Picture related APIs
'''
'''
Profile Picture related APIs (Instructor)
'''
@app.route('/api-iec/users/<int:user_id>/uploads', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_uploads_user(user_id):
    if request.method == 'POST':
        file = request.files['file']
        user = db.session.query(User).get(user_id)
            
        filename_temp = secure_filename(file.filename)
        
        user.profile_picture_mimetype = file.mimetype
        user.profile_picture = file.read()
        user.update()
        #print(user.profile_picture_mimetype)
        response = "Img has been uploaded" , 200 #destination + "/" +filename
        return response
    elif  request.method == 'GET':
        user_qr = db.session.query(User).get(user_id)
        if (user_qr.profile_picture) is None:
            abort(404)
        else:
            res = Response(base64.encodebytes(user_qr.profile_picture), mimetype=user_qr.profile_picture_mimetype)
            return res 

'''
Owner related APIs
'''
'''
Owner related APIs (general)
'''
@app.route('/api-iec/owners', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_owners():
    if request.method == 'POST':
        data = request.json
        error = False
        owner_body ={}
        try:
            owner_department = db.session.query(Department).filter(Department.name == data['department_name']).first()
            # print("\n selected department is:")
            # print(owner_department)
            owner_new = Owner(name = data['name'], department=owner_department)
            # owner_new.department_id = owner_department.id

            # print("\n\nIn Owner POST API, the department is: ", data['department_name'])
            # print("\n\nIn Owner POST API, the owner.format is: ", owner_new.format())

            owner_new.insert()
            owner_body = {
                'success': True, 
                'owner': owner_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(owner_body),201 #Created
    elif request.method == 'GET':
        owners_qr= db.session.query(Owner).filter(Owner.active == True).order_by(Owner.id).all()
        owner_list = [owner.format() for owner in owners_qr]

        # print("\n\n\n", "owner_ list")
        # print( owner_list)
        if len(owners_qr)==0:
            abort (404) #Not Found
        else:
            owner ={
                'success' : True,
                'owners' : owner_list
                }
            return jsonify(owner),200 #Ok

'''
Owner related APIs (per owner_id)
'''

@app.route('/api-iec/owners/<int:owner_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_owner_id(owner_id):
    if request.method == 'POST':
        data = request.json
        error = False
        owner_body ={}
        if (data['editAction'] == 'delete'):
            owner_edit = db.session.query(Owner).get(owner_id)
            owner_edit.delete()
            owner ={
                'success' : True
            }
            return jsonify(owner),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            owner_edit = db.session.query(Owner).get(owner_id)
            owner_edit.deactivate()
            owner ={
                'success' : True,
                'owner': owner_edit.format()
            }
            return jsonify(owner),200 #Ok
        else:
            try:
                owner_edit = db.session.query(Owner).get(owner_id)
                owner_edit.name = data['name']
                owner_edit.update()
                owner_body = {
                    'success': True, 
                    'owner': owner_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(owner_body),201 #Created
    elif request.method == 'GET':
        owner_edit = db.session.query(Owner).get(owner_id)
        owner ={
            'success' : True,
            'owner' : owner_edit.format()
            }
        return jsonify(owner),200 #Ok
        

'''
SupplyChainFeedback related APIs
'''
'''
SupplyChainFeedback related APIs (general)
'''
@app.route('/api-iec/supplyChainFeedback', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_supply_chain_feedback():
    if request.method == 'POST':
        data = request.json
        error = False
        feedback_body ={}
        try:
            feedback_new = Supply_Chain_Feedback(name = data['name'])
            feedback_new.insert()
            feedback_body = {
                'success': True, 
                'feedback': feedback_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(feedback_body),201 #Created
    elif request.method == 'GET':
        feedback_qr= db.session.query(Supply_Chain_Feedback).filter(Supply_Chain_Feedback.active == True).order_by(Supply_Chain_Feedback.id).all()
        feedback_list = [feedback.format() for feedback in feedback_qr]
        if len(feedback_qr)==0:
            abort (404) #Not Found
        else:
            feedback ={
                'success' : True,
                'feedback' : feedback_list
                }
            return jsonify(feedback),200 #Ok

'''
SupplyChainFeedback related APIs (per supplyChainFeedback_id)
'''

@app.route('/api-iec/supplyChainFeedback/<int:supplyChainFeedback_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_supply_chain_feedback_id(supplyChainFeedback_id):
    if request.method == 'POST':
        data = request.json
        error = False
        feedback_body ={}
        if (data['editAction'] == 'delete'):
            feedback_edit = db.session.query(Supply_Chain_Feedback).get(supplyChainFeedback_id)
            feedback_edit.delete()
            feedback ={
                'success' : True
            }
            return jsonify(feedback),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            feedback_edit = db.session.query(Supply_Chain_Feedback).get(supplyChainFeedback_id)
            feedback_edit.deactivate()
            feedback ={
                'success' : True,
                'feedback': feedback_edit.format()
            }
            return jsonify(feedback),200 #Ok
        else:
            try:
                feedback_edit = db.session.query(Supply_Chain_Feedback).get(supplyChainFeedback_id)
                feedback_edit.name = data['name']
                feedback_edit.update()
                feedback_body = {
                    'success': True, 
                    'feedback': feedback_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(feedback_body),201 #Created
    elif request.method == 'GET':
        feedback_edit = db.session.query(Supply_Chain_Feedback).get(supplyChainFeedback_id)
        feedback ={
            'success' : True,
            'feedback' : feedback_edit.format()
            }
        return jsonify(feedback),200 #Ok
        

'''
ProcurementFeedback related APIs
'''
'''
ProcurementFeedback related APIs (general)
'''
@app.route('/api-iec/procurementFeedback', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_procurement_feedback():
    if request.method == 'POST':
        data = request.json
        error = False
        feedback_body ={}
        try:
            feedback_new = Procurement_Feedback(name = data['name'])
            feedback_new.insert()
            feedback_body = {
                'success': True, 
                'feedback': feedback_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(feedback_body),201 #Created
    elif request.method == 'GET':
        feedback_qr= db.session.query(Procurement_Feedback).filter(Procurement_Feedback.active == True).order_by(Procurement_Feedback.id).all()
        feedback_list = [feedback.format() for feedback in feedback_qr]
        if len(feedback_qr)==0:
            abort (404) #Not Found
        else:
            feedback ={
                'success' : True,
                'feedback' : feedback_list
                }

            # print('\n\n\n\n\n')
            # print(feedback)
            return jsonify(feedback),200 #Ok

'''
Procurement_Feedback related APIs (per procurementFeedback_id)
'''

@app.route('/api-iec/procurementFeedback/<int:procurementFeedback_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_procurement_feedback_id(procurementFeedback_id):
    if request.method == 'POST':
        data = request.json
        error = False
        feedback_body ={}
        if (data['editAction'] == 'delete'):
            feedback_edit = db.session.query(Procurement_Feedback).get(procurementFeedback_id)
            feedback_edit.delete()
            feedback ={
                'success' : True
            }
            return jsonify(feedback),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            feedback_edit = db.session.query(Procurement_Feedback).get(procurementFeedback_id)
            feedback_edit.deactivate()
            feedback ={
                'success' : True,
                'feedback': feedback_edit.format()
            }
            return jsonify(feedback),200 #Ok
        else:
            try:
                feedback_edit = db.session.query(Procurement_Feedback).get(procurementFeedback_id)
                feedback_edit.name = data['name']
                feedback_edit.update()
                feedback_body = {
                    'success': True, 
                    'feedback': feedback_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(feedback_body),201 #Created
    elif request.method == 'GET':
        feedback_edit = db.session.query(Procurement_Feedback).get(procurementFeedback_id)
        feedback ={
            'success' : True,
            'feedback' : feedback_edit.format()
            }
        return jsonify(feedback),200 #Ok
 
 
'''
Department related APIs
'''
'''
Department related APIs (general)
'''
@app.route('/api-iec/departments', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_department():

    # print("\n\ndepartment api: ")
    if request.method == 'POST':
    
        data = request.json
        # print("data['name']")
        # print(data['name'])
    
        error = False
        department_body ={}
        try:
            department_new = Department(name = data['name'])
            department_new.insert()
            department_body = {
                'success': True, 
                'department': department_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(department_body),201 #Created
    elif request.method == 'GET':
        department_qr= db.session.query(Department).filter(Department.active == True).order_by(Department.id).all()
        department_list = [department.format() for department in department_qr]
        if len(department_qr)==0:
            # print("\n\nNO departments yet!")
            abort (404) #Not Found
        else:

            # print("\ndepartment_list:")
            # print(department_list)

            department ={
                'success' : True,
                'department' : department_list
                }
            return jsonify(department),200 #Ok

'''
Department related APIs (per department_id)
'''
@app.route('/api-iec/departments/<int:department_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_department_id(department_id):
    if request.method == 'POST':
        data = request.json
        error = False
        department_body ={}
        if (data['editAction'] == 'delete'):
            department_edit = db.session.query(Department).get(department_id)
            department_edit.delete()
            department ={
                'success' : True
            }
            return jsonify(department),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            department_edit = db.session.query(Department).get(department_id)
            department_edit.deactivate()
            department ={
                'success' : True,
                'department': department_edit.format()
            }
            return jsonify(department),200 #Ok
        else:
            try:
                department_edit = db.session.query(Department).get(department_id)
                department_edit.name = data['name']
                department_edit.update()
                department_body = {
                    'success': True, 
                    'department': department_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(department_body),201 #Created
    elif request.method == 'GET':
        department_edit = db.session.query(Department).get(department_id)
        department ={
            'success' : True,
            'department' : department_edit.format()
            }
        return jsonify(department),200 #Ok
 
'''
Supplier related APIs
'''
'''
Supplier related APIs (general)
'''
@app.route('/api-iec/suppliers', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_supplier():

    if request.method == 'POST':
    
        data = request.json
        error = False
        supplier_body ={}
        try:
            supplier_new = Supplier(name = data['name'])
            supplier_new.insert()
            supplier_body = {
                'success': True, 
                'supplier': supplier_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(supplier_body),201 #Created
    elif request.method == 'GET':
        supplier_qr= db.session.query(Supplier).filter(Supplier.active == True).order_by(Supplier.id).all()
        supplier_list = [supplier.format() for supplier in supplier_qr]
        if len(supplier_qr)==0:
            # print("\n\nNO suppliers yet!")
            # abort (404) #Not Found
            return "no suppliers found"
        else:
            supplier ={
                'success' : True,
                'supplier' : supplier_list
                }
            return jsonify(supplier),200 #Ok

'''
Supplier related APIs (per supplier_id)
'''
@app.route('/api-iec/suppliers/<int:supplier_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_supplier_id(supplier_id):
    if request.method == 'POST':
        data = request.json
        error = False
        supplier_body ={}
        if (data['editAction'] == 'delete'):
            supplier_edit = db.session.query(Supplier).get(supplier_id)
            supplier_edit.delete()
            supplier ={
                'success' : True
            }
            return jsonify(supplier),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            supplier_edit = db.session.query(Supplier).get(supplier_id)
            supplier_edit.deactivate()
            supplier ={
                'success' : True,
                'supplier': supplier_edit.format()
            }
            return jsonify(supplier),200 #Ok
        else:
            try:
                supplier_edit = db.session.query(Supplier).get(supplier_id)
                supplier_edit.name = data['name']
                supplier_edit.update()
                supplier_body = {
                    'success': True, 
                    'supplier': supplier_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(supplier_body),201 #Created
    elif request.method == 'GET':
        supplier_edit = db.session.query(Supplier).get(supplier_id)
        supplier ={
            'success' : True,
            'supplier' : supplier_edit.format()
            }
        return jsonify(supplier),200 #Ok


'''
DecisionSupportFeedback related APIs
'''
'''
DecisionSupportFeedback related APIs (general)
'''
@app.route('/api-iec/decisionSupportFeedback', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_decision_support_feedback():
    if request.method == 'POST':
        data = request.json
        error = False
        feedback_body ={}
        try:
            feedback_new = Decision_Support_Feedback(name = data['name'])
            feedback_new.insert()
            feedback_body = {
                'success': True, 
                'feedback': feedback_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(feedback_body),201 #Created
    elif request.method == 'GET':
        feedback_qr= db.session.query(Decision_Support_Feedback).filter(Decision_Support_Feedback.active == True).order_by(Decision_Support_Feedback.id).all()
        feedback_list = [feedback.format() for feedback in feedback_qr]
        if len(feedback_qr)==0:
            abort (404) #Not Found
        else:
            feedback ={
                'success' : True,
                'feedback' : feedback_list
                }
            return jsonify(feedback),200 #Ok

'''
DecisionSupportFeedback related APIs (per decisionSupportFeedback_id)
'''
@app.route('/api-iec/decisionSupportFeedback/<int:decisionSupportFeedback_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_decision_support_feedback_id(decisionSupportFeedback_id):
    if request.method == 'POST':
        data = request.json
        error = False
        feedback_body ={}
        if (data['editAction'] == 'delete'):
            feedback_edit = db.session.query(Decision_Support_Feedback).get(decisionSupportFeedback_id)
            feedback_edit.delete()
            feedback ={
                'success' : True
            }
            return jsonify(feedback),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            feedback_edit = db.session.query(Decision_Support_Feedback).get(decisionSupportFeedback_id)
            feedback_edit.deactivate()
            feedback ={
                'success' : True,
                'feedback': feedback_edit.format()
            }
            return jsonify(feedback),200 #Ok
        else:
            try:
                feedback_edit = db.session.query(Decision_Support_Feedback).get(decisionSupportFeedback_id)
                feedback_edit.name = data['name']
                feedback_edit.update()
                feedback_body = {
                    'success': True, 
                    'feedback': feedback_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(feedback_body),201 #Created
    elif request.method == 'GET':
        feedback_edit = db.session.query(Decision_Support_Feedback).get(decisionSupportFeedback_id)
        feedback ={
            'success' : True,
            'feedback' : feedback_edit.format()
            }
        return jsonify(feedback),200 #Ok


'''
Foreign Currency related APIs
'''
'''
Foreign Currency related APIs (general)
'''
@app.route('/api-iec/foreignCurrencies', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_foreign_currencies():
    if request.method == 'POST':
        data = request.json
        # print("EL REQUEST ELY GY LL BACKEND:")
        # print(data)
        # print(data.keys)
        error = False
        foreign_currency_body ={}
        try:
            # El parameters bnfs el esm ely f el constructor=> (name & rate)
            foreign_currency_new = Foreign_Currency(name = data['name'], rate=data['rate_to_egp'])
            foreign_currency_new.insert()
            foreign_currency_body = {
                'success': True, 
                'foreign_currencies': foreign_currency_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(foreign_currency_body),201 #Created
    
    elif request.method == 'GET':
        foreign_currency_qr= db.session.query(Foreign_Currency).filter(Foreign_Currency.active == True).order_by(Foreign_Currency.id).all()
        foreign_currency_list = [foreign_currency.format() for foreign_currency in foreign_currency_qr]
        # print("\n\n\n\n\n\ntype(foreign_currency_list)")
        # print(type(foreign_currency_list))
        if len(foreign_currency_qr)==0:
            abort (404) #Not Found
        else:
            foreign_currency ={
                'success' : True,
                'foreign_currencies' : foreign_currency_list
                }
            return jsonify(foreign_currency),200 #Ok

'''
Foreign Currency related APIs (per foreignCurrency_id)
'''

@app.route('/api-iec/foreignCurrencies/<int:foreignCurrency_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_foreign_currencies_id(foreignCurrency_id):
    if request.method == 'POST':
        data = request.json
        error = False
        foreign_currency_body ={}
        if (data['editAction'] == 'delete'):
            foreign_currency_edit = db.session.query(Foreign_Currency).get(foreignCurrency_id)
            foreign_currency_edit.delete()
            foreign_currency ={
                'success' : True
            }
            return jsonify(foreign_currency),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            foreign_currency_edit = db.session.query(Foreign_Currency).get(foreignCurrency_id)
            foreign_currency_edit.deactivate()
            foreign_currency ={
                'success' : True,
                'foreign_currencies': foreign_currency_edit.format()
            }
            return jsonify(foreign_currency),200 #Ok
        else:
            try:
                foreign_currency_edit = db.session.query(Foreign_Currency).get(foreignCurrency_id)
                foreign_currency_edit.name = data['name']
                foreign_currency_edit.rate_to_egp = data['rate_to_egp']
                foreign_currency_edit.update()
                foreign_currency_body = {
                    'success': True, 
                    'foreign_currencies': foreign_currency_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(foreign_currency_body),201 #Created
    elif request.method == 'GET':
        foreign_currency_edit = db.session.query(Foreign_Currency).get(foreignCurrency_id)
        foreign_currency ={
            'success' : True,
            'foreign_currencies' : foreign_currency_edit.format()
            }
        return jsonify(foreign_currency),200 #Ok
        

'''
Status related APIs
'''
'''
Status related APIs (general)
'''
@app.route('/api-iec/status', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_status():
    if request.method == 'POST':
        data = request.json
        error = False
        status_body ={}
        try:
            status_new = Status(name = data['name'])
            status_new.insert()
            status_body = {
                'success': True, 
                'status': status_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(status_body),201 #Created
    elif request.method == 'GET':
        status_qr= db.session.query(Status).filter(Status.active == True).order_by(Status.id).all()
        status_list = [status.format() for status in status_qr]
        if len(status_qr)==0:
            abort (404) #Not Found
        else:
            status ={
                'success' : True,
                'status' : status_list
                }
            return jsonify(status),200 #Ok

'''
Status related APIs (per status_id)
'''
@app.route('/api-iec/status/<int:status_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_status_id(status_id):
    if request.method == 'POST':
        data = request.json
        error = False
        status_body ={}
        if (data['editAction'] == 'delete'):
            status_edit = db.session.query(Status).get(status_id)
            status_edit.delete()
            status ={
                'success' : True
            }
            return jsonify(status),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            status_edit = db.session.query(Status).get(status_id)
            status_edit.deactivate()
            status ={
                'success' : True,
                'status': status_edit.format()
            }
            return jsonify(status),200 #Ok
        else:
            try:
                status_edit = db.session.query(Status).get(status_id)
                status_edit.name = data['name']
                status_edit.update()
                status_body = {
                    'success': True, 
                    'status': status_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(status_body),201 #Created
    elif request.method == 'GET':
        status_edit = db.session.query(Status).get(status_id)
        status ={
            'success' : True,
            'status' : status_edit.format()
            }
        return jsonify(status),200 #Ok
        


'''
Product_Type related APIs
'''
'''
Product_Type related APIs (general)
'''
@app.route('/api-iec/productType', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_product_type():
    # print("IN IEC TYPE API")
    if request.method == 'POST':
        data = request.json
        error = False
        productType_body ={}
        try:
            productType_new = Product_Type(name = data['name'])
            productType_new.insert()
            productType_body = {
                'success': True, 
                'productType': productType_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(productType_body),201 #Created
    elif request.method == 'GET':
        productType_qr = db.session.query(Product_Type).filter(Product_Type.active == True).order_by(Product_Type.id).all()
        productType_list = [productType.format() for productType in productType_qr]
        if len(productType_qr)==0:
            abort (404) #Not Found
        else:
            productType ={
                'success' : True,
                'productType' : productType_list
                }
            return jsonify(productType),200 #Ok

'''
Product_Type related APIs (per productType_id)
'''
@app.route('/api-iec/productType/<int:productType_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_product_type_id(productType_id):
    if request.method == 'POST':
        data = request.json
        error = False
        productType_body ={}
        if (data['editAction'] == 'delete'):
            productType = db.session.query(Product_Type).get(productType_id)
            productType.delete()
            productType ={
                'success' : True
            }
            return jsonify(productType),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            productType_edit = db.session.query(Product_Type).get(productType_id)
            productType_edit.deactivate()
            productType ={
                'success' : True,
                'productType': productType_edit.format()
            }
            return jsonify(productType),200 #Ok
        else:
            try:
                productType_edit = db.session.query(Product_Type).get(productType_id)
                productType_edit.name = data['name']
                productType_edit.update()
                productType_body = {
                    'success': True, 
                    'productType': productType_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(productType_body),201 #Created
    elif request.method == 'GET':
        productType_edit = db.session.query(Product_Type).get(productType_id)
        productType ={
            'success' : True,
            'productType' : productType_edit.format()
            }
        return jsonify(productType),200 #Ok
        

'''
IEC related APIs
'''
'''
IEC related APIs (general)
'''
@app.route('/api-iec/iec', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_iec():
    # print("IN IEC API")
    if request.method == 'POST':
        data = request.json
        error = False
        iec_body ={}
        try:
            sp_feedback_name = data['supply_chain_feedback']
            sp_feedback = db.session.query(Supply_Chain_Feedback).filter(Supply_Chain_Feedback.name == sp_feedback_name).first()
            if sp_feedback == None:
                new_feedback = Supply_Chain_Feedback(name = sp_feedback_name)
                new_feedback.insert()
                sp_feedback = db.session.query(Supply_Chain_Feedback).filter(Supply_Chain_Feedback.name == sp_feedback_name).first()

            pr_feedback_name = data['procurement_feedback']
            pr_feedback = db.session.query(Procurement_Feedback).filter(Procurement_Feedback.name == pr_feedback_name).first()
            if pr_feedback == None:
                new_feedback = Procurement_Feedback(name=pr_feedback_name)
                new_feedback.insert()
                pr_feedback = db.session.query(Procurement_Feedback).filter(Procurement_Feedback.name == pr_feedback_name).first()

            ds_feedback_name = data['decision_support_feedback']
            ds_feedback = db.session.query(Decision_Support_Feedback).filter(Decision_Support_Feedback.name == ds_feedback_name).first()
            if ds_feedback == None:
                print("\n\nNONE CONDITION")
                new_feedback = Decision_Support_Feedback(name=ds_feedback_name)
                new_feedback.insert()

                ds_feedback = db.session.query(Decision_Support_Feedback).filter(
                    Decision_Support_Feedback.name == ds_feedback_name).first()

            status_name = data['status_name']

            status = db.session.query(Status).filter(Status.name == status_name).first()
            project_description = data['project_description']
            project_title = data['project_title']
            project_justification = data['project_justification']
            project_comment = data['project_comment']
            request_date = data['request_date']
            start_date = data['start_date']
            iec_date = data['iec_date']
            finance_number = data['finance_number']
            capex_egp = data['capex_egp']
            opex_egp = data['opex_egp']
            number_of_years = data['number_of_years']
            annual = data['is_annual']
            is_annual = False
            if annual == 'True':
                is_annual = True
            # print('\n\n\n type of is annual: ', type(is_annual), annual, '\n\n\n')
            # iec_attachment_name = data['iec_attachment_name']
            # iec_attachment = data['uploaded_iec_attachment']

            iec_new = IEC(project_title=project_title,
             project_description=project_description,
            request_date=request_date,
            justification=project_justification,
            # attachment_name=iec_attachment_name,
            comment=project_comment,
          finance_number=finance_number,
          status=status,
          supply_chain_feedback=sp_feedback,
          procurement_feedback=pr_feedback,
          decision_support_feedback=ds_feedback,
          is_annual=is_annual,
          number_of_years=number_of_years)

            iec_new.insert()
            iec_new.start_date = start_date
            iec_new.iec_date = iec_date
            # iec_new.attachment_name = iec_attachment_name
            # iec_new.attachment = iec_attachment
            iec_new.capex_egp = capex_egp
            iec_new.opex_egp = opex_egp
            iec_new.total_egp = iec_new.opex_egp + iec_new.capex_egp

            print("\n\n\n\nTHE NEWLY ADDED IEC IS: ", iec_new.id)
            print(iec_new)

            iec_body = {
                'success': True, 
                'iec': iec_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(iec_body),201 #Created
    elif request.method == 'GET':
        iec_qr= db.session.query(IEC).filter(IEC.active == True).order_by(IEC.id).all()
        iec_list = [iec.format() for iec in iec_qr]
        if len(iec_qr)==0:
            abort (404) #Not Found
        else:
            iec ={
                'success' : True,
                'iec' : iec_list
                }

            return jsonify(iec),200 #Ok

'''
IEC related APIs (per iec_id)
'''
@app.route('/api-iec/iec/<int:iec_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_iec_id(iec_id):
    if request.method == 'POST':
        data = request.json
        error = False
        iec_body ={}
        if (data['editAction'] == 'delete'):
            iec = db.session.query(IEC).get(iec_id)

            #! BEFORE DELETION, MAKE SURE it's not used as a foreign key in other IEC items
            iec_dep_types_qr = db.session.query(IEC_Dep_Type).filter(IEC_Dep_Type.active==True,IEC_Dep_Type.iec_id==iec.id).all()
            if len(iec_dep_types_qr) != 0:
                iec={
                    'success': 'used as a foreign key'
                }
            else:
                iec.delete()
                iec ={
                    'success' : True
                }
            return jsonify(iec),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            iec_edit = db.session.query(IEC).get(iec_id)
            iec_edit.deactivate()
            iec ={
                'success' : True,
                'iec': iec_edit.format()
            }
            return jsonify(iec),200 #Ok
        else: #Edit
            try:
                iec_edit = db.session.query(IEC).get(iec_id)

                iec_edit.project_title = data['project_title']
                iec_edit.project_description = data['project_description']
                iec_edit.justification = data['justification']

                if data['request_date'] == '':
                    data['request_date'] = date.min
                else:
                    iec_edit.request_date = data['request_date']
                # if data['start_date'] == '':
                data['start_date'] = date.min
                # else:
                #     iec_edit.start_date = data['start_date']
                if data['iec_date'] == '':
                    iec_edit.iec_date = date.min
                else:
                    iec_edit.iec_date = data['iec_date']

                tech_number = int((data['tech_number'].split('_'))[1])
                iec_edit.tech_number = tech_number

                finance_number = int((data['finance_number'].split('_'))[1])
                iec_edit.finance_number = finance_number

                iecStatus = db.session.query(Status).filter(Status.name==data['status']).first()
                iec_edit.status = iecStatus

                iecDsFeedback = db.session.query(Decision_Support_Feedback).filter(
                    Decision_Support_Feedback.name == data['decision_support_feedback']).first()
                iec_edit.decision_support_feedback = iecDsFeedback

                iecSCFeedback = db.session.query(Supply_Chain_Feedback).filter(
                    Supply_Chain_Feedback.name == data['supply_chain_feedback']).first()
                iec_edit.supply_chain_feedback = iecSCFeedback

                iecPRFeedback = db.session.query(Procurement_Feedback).filter(
                    Procurement_Feedback.name == data['procurement_feedback']).first()
                iec_edit.procurement_feedback = iecPRFeedback

                
                # is_annual = False
                # if data['is_annual'].lower() == 'True'.lower():
                #     is_annual = True

                # iec_edit.is_annual = is_annual
                iec_edit.is_annual = data['is_annual']
                
                number_of_year = 0
                if isinstance(data['number_of_years'],int):
                    number_of_year = int(data['number_of_years'])
                
                iec_edit.number_of_years = number_of_year

                # iec_edit.attachment_name = data['attachment_name']
                # iec_edit.attachment = data['uploaded_iec_attachment']

                iec_edit.update()
                # print("\n\n\n\n iec_edit.project_title AFTER:")

                iec_body = {
                    'success': True, 
                    'iec': iec_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(iec_body),201 #Created
    elif request.method == 'GET':
        iec_edit = db.session.query(IEC).get(iec_id)
        iec_dep_types = db.session.query(IEC_Dep_Type).filter(IEC_Dep_Type.iec_id == iec_id).all()
        iec_dep_types_list = [item.format() for item in iec_dep_types]
 
        iec ={
            'success' : True,
            'iec' : iec_edit.format(),
            'iecDepTypes':iec_dep_types_list
            }
        return jsonify(iec),200 #Ok

'''
IEC_Dep_Type related APIs
'''
'''
IEC_Dep_Type related APIs (general)
'''
@app.route('/api-iec/iecDepType', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_iec_dep_type():
    # print("\n\n\n\nIN IEC_Dep_Type API")
    if request.method == 'POST':
        data = request.json
        error = False
        iecDepType_body ={}
        try:

            # print("\n\n\nwariny kda el data")
            # print(data)
            # print('\n\n\n\n')

            currency_name = data['currency_name']
            owner_name = data['owner_name']
            # department_name = data['department_name']
            iec_parent_id = data['iec_parent_id']
            product_type_name = data['productType_name']
            opex_egp = data['opex_egp']
            capex_egp = data['capex_egp']
            final_rate = data['final_rate']
            
            realocationPO = False
            if data['realocationPO'] =='True':
                realocationPO = True
            realocationPR = False
            if data['realocationPR'] == 'True':
                realocationPR = True
            # final_rate = data['final_rate']

            iec_parent = db.session.query(IEC).filter(IEC.id == iec_parent_id).first();
            currency = db.session.query(Foreign_Currency).filter(Foreign_Currency.name == currency_name).first();

            # print('\n\n\n Currency is:')
            # print(currency)

            isForeign = False
            isCapex = False
            isOpex = False
            if currency_name != 'EGP':
                isForeign = True
            if capex_egp != '' or capex_egp != null:
                isCapex = True
            if opex_egp != '' or opex_egp != null:
                isOpex = True

            # department = db.session.query(Department).filter(Department.name == department_name).first()
            owner = db.session.query(Owner).filter(Owner.name == owner_name).first()
            
            # print('\n\n\n owner is:')
            # print(owner)
            
            product_type = db.session.query(Product_Type).filter(Product_Type.name == product_type_name).first()

            # print('\n\n\n product_type is:')
            # print(product_type)

            # print('\n\n\n iecParent is:')
            # print(iec_parent)
           
            # print('\n\n\n is_foreign_currency is:')
            # print(isForeign)

            # print('\n\n\n icCapex is:')
            # print(isCapex)

            # print('\n\n\n isOpex is:')
            # print(isOpex)

            iecDepType_new = IEC_Dep_Type(item_description=data['description'],
                             is_foreign_currency=isForeign,
                            is_capex=isCapex, is_opex=isOpex, iec=iec_parent, 
                            product_type=product_type, foreign_currency=currency, owner=owner,
                            need_realocation_PR=realocationPR,need_realocation_PO=realocationPO,
                                          capex_egp=capex_egp, opex_egp=opex_egp)
            iecDepType_new.insert()
            iecDepType_body = {
                'success': True, 
                'iecItem': iecDepType_new.format()
            }
        except ValueError:
            error = True
            db.session.rollback()
        finally:
            db.session.close()
        if error:
            abort(ValueError) #Bad Request
        else:
            return jsonify(iecDepType_body), 201  # Created
    elif request.method == 'GET':
        iecItem_qr= db.session.query(IEC_Dep_Type).filter(IEC_Dep_Type.active == True).order_by(IEC_Dep_Type.iec_id).all()
       
        iecItem_list = [iecItem.format() for iecItem in iecItem_qr]
        # print("\nresult el query:")
        # print(iecItem_list)
        if len(iecItem_qr)==0:
            abort (404) #Not Found
        else:
            iecItem ={
                'success' : True,
                'iecItem' : iecItem_list
                }
            return jsonify(iecItem),200 #Ok

'''
IEC_Dep_Type related APIs (per iec_dep_type_id)
'''
@app.route('/api-iec/iecDepType/<int:iec_dep_type_id>', methods = ['GET','POST'])
@jwt_required
@cross_origin()
def handle_iec_dep_type_id(iec_dep_type_id):
    if request.method == 'POST':
        data = request.json
        error = False
        iec_dep_type_body ={}
        if (data['editAction'] == 'delete'):
            iec_dep_type = db.session.query(IEC_Dep_Type).get(iec_dep_type_id)
            iec_dep_type.delete()
            iec_dep_type ={
                'success' : True
            }
            return jsonify(iec_dep_type),200 #Ok
        elif (data['editAction'] == 'deactivate'):
            iec_dep_type_edit = db.session.query(IEC_Dep_Type).get(iec_dep_type_id)
            iec_dep_type_edit.deactivate()
            iec_dep_type ={
                'success' : True,
                'iec_dep_type': iec_dep_type_edit.format()
            }
            return jsonify(iec_dep_type),200 #Ok
        else:
            try:
                iec_dep_type_edit = db.session.query(IEC_Dep_Type).get(iec_dep_type_id)
                iec_dep_type_edit.description = data['description']
                iec_dep_type_edit.final_rate = data['final_rate']
                iec_dep_type_edit.capex_egp = data['capex_egp']
                iec_dep_type_edit.ppex_egp = data['opex_egp']
                iec_dep_type_edit.need_realocation_PR = data['need_realocation_PR']
                iec_dep_type_edit.owner.name = data['owner_name']
                iec_dep_type_edit.product_type.name = data['product_type']

                iec_dep_type_edit.update()
                iec_dep_type_body = {
                    'success': True, 
                    'iec_dep_type': iec_dep_type_edit.format()
                }
            except ValueError:
                error = True
                db.session.rollback()
            finally:
                db.session.close()
            if error:
                abort(ValueError) #Bad Request
            else:
                return jsonify(iec_dep_type_body),201 #Created
    elif request.method == 'GET':
        iec_dep_type_edit = db.session.query(IEC_Dep_Type).get(iec_dep_type_id)
        iec_dep_type ={
            'success' : True,
            'iec_dep_type' : iec_dep_type_edit.format()
            }
        return jsonify(iec_dep_type),200 #Ok
        

@app.route("/", methods = ['GET','POST'])
@cross_origin()
def Hello():
    if request.method == 'GET':
    #row = db.session.query(Users).filter(Users.userName == 'yous').first()
    #print(row.fName)
        return jsonify({"message":"Hello World!"})
    elif request.method == 'POST':
        #print('file = ',request.files['file'])
        return jsonify({"message":"Hello World!"})

'''
401 Un-authorized Error 
'''
@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        "success": False, 
        "error": 401,
        "message": "Un-authurized Access - Bad Username or Password"
        }), 401
'''
403 Un-authorized Error 
'''
@app.errorhandler(403)
def forbidden(error):
    return jsonify({
        "success": False, 
        "error": 403,
        "message": "forbidden Request - Username is not allowed to proceed with that request"
        }), 403


'''
@TODO: 
Create error handlers for all expected errors 
including 404 and 422. 
'''
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False, 
        "error": 404,
        "message": "Not found"
        }), 404

@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        "success": False, 
        "error": 422,
        "message": "unprocessable"
        }), 422

@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "success": False, 
        "error": 400,
        "message": "Bad Request"
        }), 400

# return app


# create_app()
# set FLASK_APP=flaskr
# set FLASK_ENVIRONMENT=dev
# set FLASK_DEBUG=true

# flask run --port=8000
