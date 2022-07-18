# from datetime import datetime, date, timezone, timedelta
from datetime import date
from models import *
# IEC_Item, User, Status, Product_Type, Supply_Chain_Feedback,\
#    Procurement_Feedback, Decision_Support_Feedback, Foreign_Currency, Department#, Insert_Error
# import json
from werkzeug.security import generate_password_hash, check_password_hash

# def Insert_Error(error):
#     return { 
#         "success": False,
#         "error": error.status_code,
#         "message": error.error['description']
#     }


# spl = Supplier(name="Supplier_1")
# spl.insert()

# spl = Supplier(name="Supplier_2")
# spl.insert()

# spl = Supplier(name="Supplier_3")
# spl.insert()

# spl = Supplier(name="Supplier_4")
# spl.insert()

print('Supplier Table Filled')

spl = db.session.query(Supplier).filter(
    Supplier.name == "Supplier_1").first()


# # Fill Users Table:
# khawaga = User(username = 'mkhawaga', orange_id = None, password = generate_password_hash("0000"), 
#   first_name = 'Mohamed', last_name = "Khawaga", title="Sr. Manager, RF Planning & integration, TECHNOLOGY", email ="mohamed.khawaga@orange.com",
#   profile_picture= None, profile_picture_mimetype = None, phone = "01222446170",
#   is_integration_engineer = False, is_audit = False, is_manager = True, is_admin = False, is_super_user = False)
# khawaga.insert()

# barkoky = User(username = 'ielbarkoky', orange_id = None, password = generate_password_hash("0000"), 
#   first_name = 'Ibrahim', last_name = "El Barkoky", title="Sr. Supervisor, RF integration, TECHNOLOGY", email ="ibrahim.barkoky@orange.com",
#   profile_picture= None, profile_picture_mimetype = None, phone = "01225299105",
#   is_integration_engineer = False, is_audit = False, is_manager = True, is_admin = False, is_super_user = False)
# barkoky.insert()

# gamal = User(username = 'memara', orange_id = None, password = generate_password_hash("0000"), 
#   first_name = 'Mohamed', last_name = "Gamal Emara", title="RF Integration and Design Consultant", email ="memara.ext@orange.com",
#   profile_picture= None, profile_picture_mimetype = None, phone = "01201111080",
#   is_integration_engineer = True, is_audit = False, is_manager = False, is_admin = False, is_super_user = True)
# gamal.insert()

# nada = User(username = 'nkhaled', orange_id = None, password = generate_password_hash("0000"), 
#   first_name = 'Nada', last_name = "Khaled", title="", email ="nada.khaled.ext@orange.com",
#   profile_picture= None, profile_picture_mimetype = None, phone = "01222222222",
#   is_integration_engineer = False, is_audit = False, is_manager = False, is_admin = False, is_super_user = True)
# nada.insert()

# sherif = User(username = 'selgharabawy', orange_id = 7453, password = generate_password_hash("0000"), 
#   first_name = 'Sherif', last_name = "El Gharabawy", title="Supervisor, RF Planning, TECHNOLOGY", email ="sherif.gharabawy@orange.com",
#   profile_picture= None, profile_picture_mimetype = None, phone = "01276999767",
#   is_integration_engineer = False, is_audit = False, is_manager = False, is_admin = False, is_super_user = True)
# sherif.insert()

# wessam = User(username = 'wmabdelkhalik', orange_id = None, password = generate_password_hash("0000"), 
#   first_name = 'Wessam', last_name = "Abd Elkhalik", title="Supervisor, RF Planning, TECHNOLOGY", email ="wessam.abdelkhalik@orange.com",
#   profile_picture= None, profile_picture_mimetype = None, phone = "01285844773",
#   is_integration_engineer = False, is_audit = True, is_manager = False, is_admin = False, is_super_user = False)
# wessam.insert()

# hesham = User(username = 'hmkhalil', orange_id = None, password = generate_password_hash("0000"), 
#   first_name = 'Sherif', last_name = "El Gharabawy", title="Supervisor, Network Management Solutions, TECHNOLOGY", email ="Hesham Mohamed Khalil <hesham.khalil@orange.com>",
#   profile_picture= None, profile_picture_mimetype = None, phone = "01227119557",
#   is_integration_engineer = False, is_audit = False, is_manager = False, is_admin = True, is_super_user = False)
# hesham.insert()

# print("Users Table Filled")


# # Fill Status Lookup table:
# draft = Status(name='Draft')
# draft.insert()
# proposed = Status(name='Proposed')
# proposed.insert()
# approved = Status(name='Approved')
# approved.insert()
# rejected = Status(name='Rejected')
# rejected.insert()
# pending = Status(name='Pending')
# pending.insert()
# on_hold = Status(name='On Hold')
# on_hold.insert()
# issued = Status(name='Issued')
# issued.insert()
# returned = Status(name='Returned')
# # returned.insert()
# in_progress = Status(name='In Progress')
# # in_progress.insert()

# print("Status Table Filled")


approved = db.session.query(Status).filter(
    Status.name == "Approved").first()

proposed = db.session.query(Status).filter(
    Status.name == "Proposed").first()

returned = db.session.query(Status).filter(
    Status.name == "Returned").first()

issued = db.session.query(Status).filter(
    Status.name == "Issued").first()

on_hold = db.session.query(Status).filter(
    Status.name == "On Hold").first()

rejected = db.session.query(Status).filter(
    Status.name == "Rejected").first()

pending = db.session.query(Status).filter(
    Status.name == "Pending").first()

in_progress = db.session.query(Status).filter(
    Status.name == "In Progress").first()


# # Fill Product_Type Lookup table:
# sw = Product_Type(name='SW')
# sw.insert()
# hw = Product_Type(name='HW')
# hw.insert()
# services = Product_Type(name='Services')
# services.insert()

# print("Product_Type Table Filled")

sw = db.session.query(Product_Type).filter(
    Product_Type.name == "SW").first()
hw = db.session.query(Product_Type).filter(
    Product_Type.name == "HW").first()
services = db.session.query(Product_Type).filter(
    Product_Type.name == "Services").first()


# # Fill Supply_Chain_Feedback Lookup table:
# sp_feedback_1 = Supply_Chain_Feedback(name='Presentation Sent')
# sp_feedback_1.insert()
# sp_feedback_2 = Supply_Chain_Feedback(name='BoQ is not ready and the validation will take place once the PR placed on the system')
# sp_feedback_2.insert()
# sp_feedback_3 = Supply_Chain_Feedback(name='This is SW and SRV only no HW required to be purchased')
# sp_feedback_3.insert()
# sp_feedback_4 = Supply_Chain_Feedback(name='Waiting feedback from the owner')
# sp_feedback_4.insert()
# sp_feedback_5 = Supply_Chain_Feedback(name='Other') #open a text field to write his feedback
# sp_feedback_5.insert()

# print("Supply_Chain_Feedback Table Filled")

sp_feedback_1 = db.session.query(Supply_Chain_Feedback).filter(
    Supply_Chain_Feedback.name == "Presentation Sent").first()
sp_feedback_2 = db.session.query(Supply_Chain_Feedback).filter(
    Supply_Chain_Feedback.name == "BoQ is not ready and the validation will take place once the PR placed on the system").first()
sp_feedback_3 = db.session.query(Supply_Chain_Feedback).filter(
    Supply_Chain_Feedback.name == "This is SW and SRV only no HW required to be purchased").first()
sp_feedback_4 = db.session.query(Supply_Chain_Feedback).filter(
    Supply_Chain_Feedback.name == "Waiting feedback from the owner").first()
sp_feedback_5 = db.session.query(Supply_Chain_Feedback).filter(
    Supply_Chain_Feedback.name == "Other").first()



# # Fill Procurement_Feedback Lookup table:
# procurement_feedback_1 = Procurement_Feedback(name='Presentation Sent')
# procurement_feedback_1.insert()
# procurement_feedback_3 = Procurement_Feedback(name='Not Ready')
# procurement_feedback_3.insert()
# procurement_feedback_2 = Procurement_Feedback(name='Other') #open a text field to write his feedback
# procurement_feedback_2.insert()

# print("Procurement_Feedback Table Filled")

procurement_feedback_1 = db.session.query(Procurement_Feedback).filter(
    Procurement_Feedback.name == "Presentation Sent").first()

procurement_feedback_2 = db.session.query(Procurement_Feedback).filter(
    Procurement_Feedback.name == "Other").first()

procurement_feedback_3 = db.session.query(Procurement_Feedback).filter(
    Procurement_Feedback.name == "Not Ready").first()


# Fill Decision_Support_Feedback Lookup table:
# ds_feedback_1 = Decision_Support_Feedback(name='Confirmed')
# ds_feedback_1.insert()
# ds_feedback_2 = Decision_Support_Feedback(name='Pending Owner')
# ds_feedback_2.insert()
# ds_feedback_3 = Decision_Support_Feedback(name='Not Ready')
# ds_feedback_3.insert()
# ds_feedback_4 = Decision_Support_Feedback(name='Other') #open a text field to write his feedback
# ds_feedback_4.insert()

# print("Decision_Support_Feedback Table Filled")

ds_feedback_1 = db.session.query(Decision_Support_Feedback).filter(
    Decision_Support_Feedback.name == "Confirmed").first()
    
ds_feedback_2 = db.session.query(Decision_Support_Feedback).filter(
    Decision_Support_Feedback.name == "Pending Owner").first()

ds_feedback_3 = db.session.query(Decision_Support_Feedback).filter(
    Decision_Support_Feedback.name == "Not Ready").first()

ds_feedback_4 = db.session.query(Decision_Support_Feedback).filter(
    Decision_Support_Feedback.name == "Other").first()



# Fill Foreign_Currency table:
#? el name should be Dollar or $ ==> to concatenate it with IEC_Item
# dollar = Foreign_Currency(name='Dollar', rate=18.27)
# dollar.insert()

# euro = Foreign_Currency(name='Euro', rate=19.29)
# euro.insert()
# print("Foreign_Currency Table Filled")


dollar = db.session.query(Foreign_Currency).filter(
    Foreign_Currency.name == "Dollar").first()
euro = db.session.query(Foreign_Currency).filter(
    Foreign_Currency.name == "Euro").first()



# # Fill Cost_center table:
# cost_center_1 = Cost_Center(cost_center="Cost Center 1")
# cost_center_1.insert()
# print("\n\nf el-main")
# print("cost center 1")
# print(cost_center_1.format())

# cost_center_2 = Cost_Center(cost_center="Cost Center 2")
# cost_center_2.insert()
# print("\n\ncost center 2")
# print(cost_center_2.format())

# print("Cost Center Table Filled")


# # Fill Department table:
# network = Department(name='Network', cost_center=cost_center_1)
# network.insert()
network = db.session.query(Department).filter(Department.name == "Network").first()

# finance = Department(name='Finance', cost_center=cost_center_2)
# finance.insert()
finance = db.session.query(Department).filter(Department.name == "Finance").first()

# print("Department Table Filled")

# owner_1 = Owner(name="New Owner_1",department=network)
# owner_1.insert()

# owner_2 = Owner(name="New Owner_2",department=finance)
# owner_2.insert()

# print("Owner Table Filled")

owner_1 = db.session.query(Owner).filter(
    Owner.name == "New Owner_1").first()

owner_2 = db.session.query(Owner).filter(
    Owner.name == "New Owner_2").first()


# Use flush() when you need to simulate a write,
# for example to get a primary key ID from an auto-incrementing counter.

iec = IEC(project_title="IEC Title_1",project_description="IEC Description_1",justification="justification 1",
          request_date=date.today(),
          attachment=None,
          # attachment_name='Attachment_1',
          comment="IEC Comment_1",
          finance_number=1,status=issued,
          # product_type=services,
          supply_chain_feedback=sp_feedback_1,procurement_feedback=procurement_feedback_1,
          decision_support_feedback=ds_feedback_1,is_annual=True,number_of_years=7)

iec.insert()

iec_2 = IEC(project_title="IEC Title_2",project_description="IEC Description_2",request_date=date.today(),
            justification="justification 2",
            attachment=None,
            # attachment_name='Attachment_2',
            comment="IEC Comment_2",
            finance_number=2,status=issued,
            # product_type=sw,
            supply_chain_feedback=sp_feedback_2,procurement_feedback=procurement_feedback_2,
            decision_support_feedback=ds_feedback_2,is_annual=True,number_of_years=5)

iec_2.insert()

iec_3 = IEC(project_title="IEC Title_3",project_description="IEC Description_3",request_date=date.today(),
            justification="justification 3",
            attachment=None,
            # attachment_name='Attachment_3',
            comment="IEC Comment_3",
            finance_number=3,status=issued,
            # product_type=hw,
            supply_chain_feedback=sp_feedback_3,procurement_feedback=procurement_feedback_3,
            decision_support_feedback=ds_feedback_3,is_annual=True,number_of_years=3)

iec_2.insert()

print("\n\n--------------------------------- IEC INSERTED!!!! ---------------------------------")

# print('\n\n\n\n>>>> EL OWNER:')
# print(owner_1.format())
# print("\n\nowner_2.format()")
# print(owner_2.format())

test = db.session.query(Owner).filter(Owner.id == owner_2.id).all()
# print("\n\nlen(Test)")
# print(len(test))
# print(test[0].format())
# print('\n\n')

iec_item = IEC_Dep_Type(item_description="IEC Item Description_2", is_foreign_currency=True,
                        is_capex=True, is_opex=True, iec=iec, product_type=sw,
                        need_realocation_PR=False, need_realocation_PO=True,foreign_currency=dollar,owner=owner_2,
                        capex_egp=2000.0, opex_egp=2000.0)

iec_item.insert()

iec_item = IEC_Dep_Type(item_description="IEC Item Description_1",is_foreign_currency=True,
                        product_type=hw,is_capex=True,is_opex=True,iec=iec,
                        foreign_currency=dollar,owner=owner_1,need_realocation_PR=True,
                        need_realocation_PO=False,capex_egp=1000.0, opex_egp=1000.0)

iec_item.insert()



iec_item = IEC_Dep_Type(item_description="IEC Item Description_3",is_foreign_currency=True,
                        product_type=sw,is_capex=True,is_opex=True,iec=iec_2,
                        foreign_currency=dollar,owner=owner_2,need_realocation_PR=True,
                        need_realocation_PO=True,capex_egp=3000.0, opex_egp=3000.0)

iec_item.insert()

iec_item = IEC_Dep_Type(item_description="IEC Item Description_4",is_foreign_currency=True,
                        product_type=services,is_capex=True,is_opex=True,iec=iec,
                        foreign_currency=dollar,owner=owner_2,need_realocation_PR=False,
                        need_realocation_PO=False,capex_egp=4000.0, opex_egp=4000.0)


iec_item.insert()

iec_item = IEC_Dep_Type(item_description="IEC Item Description_5",is_foreign_currency=True,
                        product_type=services,is_capex=True, is_opex=True, iec=iec_3,
                        foreign_currency=dollar, owner=owner_1,need_realocation_PR=True,
                        need_realocation_PO=False,capex_egp=5000.0, opex_egp=5000.0)

iec_item.insert()

iec_item = IEC_Dep_Type(item_description="IEC Item Description_6",is_foreign_currency=True,
                        product_type=hw,is_capex=True, is_opex=True, iec=iec_2,
                        foreign_currency=dollar, owner=owner_1,need_realocation_PR=False,
                        need_realocation_PO=True,capex_egp=6000.0, opex_egp=6000.0)

iec_item.insert()
print("\n\n--------------------------------- IEC Items INSERTED!!!! ---------------------------------")

print("\n**** 7amdellah 3la el salama :) Data inserted!")

