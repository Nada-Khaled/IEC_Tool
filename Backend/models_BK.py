# from email.policy import default
# import os
# from io import BytesIO
# from tkinter.font import names
# from pyparsing import nullDebugAction
from email.policy import default
from flask import Flask
from sqlalchemy import Column, ForeignKey, String, Integer, Float, Boolean, DateTime, LargeBinary, create_engine
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from datetime import date
from flask_sqlalchemy import SQLAlchemy
# import pandas as pd
# import math


import json
#from sqlalchemy import func

database_name = "iecdb"
                        #first parameter: username:password@host:port
database_path = "postgresql://{}/{}".format('postgres:postgres@localhost:5432', database_name)

app = Flask(__name__)

'''
UnComment the following line
'''
db = SQLAlchemy()

# binds a flask application and a SQLAlchemy service
'''
def setup_db(app, database_path=database_path):
    # Uncomment the following lines
    
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()

    #or use this:
    # if not database_exists(database_path):
    #   create_database(database_path)

    # engine = create_engine(database_path)
    

    #Comment the following lines
    ''
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.drop_all()
    db.create_all()
    db.session.commit()
    ''
  
'''
def setup_db(app, database_path=database_path):
  
  if not database_exists(database_path):
    print("Database not found!")
    create_database(database_path)
    print("DataBase created.")

  else:
    print(" >> Database already exists.")

  engine = create_engine(database_path)

  print("\n >> Engine URL: ", engine.url)

  session = sessionmaker(bind=engine)()

  app.config["SQLALCHEMY_DATABASE_URI"] = database_path
  db.app = app
  db.init_app(app)
  db.create_all()

  return session

class User(db.Model):  
  __tablename__ = 'users'
  
  id = Column(Integer, primary_key=True, autoincrement = True)
  username = Column(String, nullable = False, unique = True)
  orange_id = Column(Integer, nullable = True, unique = True)
  password = Column(String, nullable = False) 
  
  first_name = Column(String, nullable = True) 
  last_name = Column(String, nullable = True) 
  title = Column(String, nullable = True) 
  email = Column(String, nullable = False , unique = True) 
  profile_picture = Column(LargeBinary, nullable = True)
  profile_picture_mimetype = Column(db.Text, nullable = True)
  phone = Column(String, nullable = False) 
  
  is_integration_engineer = Column(Boolean, nullable = False, default = False)
  is_audit = Column(Boolean, nullable = False, default = False)
  is_manager = Column(Boolean, nullable = False, default = False)
  is_admin = Column(Boolean, nullable = False, default = True)
  is_super_user = Column(Boolean, nullable = False, default = False) #new
  
  active = Column(Boolean, nullable = False, default = True)

  
  def __init__(self, username, orange_id, password,
  first_name, last_name, title, email, profile_picture,
  profile_picture_mimetype, phone, is_integration_engineer, is_audit, is_manager, is_admin, is_super_user):
    self.active = True
    self.username = username
    self.orange_id = orange_id
    self.password = password
    self.first_name = first_name
    self.last_name = last_name
    self.title = title
    self.email = email
    self.profile_picture = profile_picture
    self.profile_picture_mimetype = profile_picture_mimetype
    self.phone = phone
    self.is_integration_engineer = is_integration_engineer
    self.is_audit = is_audit
    self.is_manager = is_manager
    self.is_admin = is_admin
    self.is_super_user = is_super_user
    
  def insert(self):
    db.session.add(self)
    db.session.commit()
    
  def update(self):
    db.session.commit()
    

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def deactivate(self):
    self.active = False
    db.session.commit()

  def format(self):
    if (self.is_integration_engineer):
      role = 'Integration Engineer'
    elif (self.is_super_user):
      role = 'Super User'
    elif (self.is_audit):
      role = 'Audit'
    elif (self.is_admin):
      role = 'Administrator'
    elif (self.is_manager):
      role = 'Manager'
    
    return {
        'id': self.id,
        'orange_id': self.orange_id,
        'username': self.username,
        'password' : self.password,
        'first_name': self.first_name,
        'last_name': self.last_name,
        'full_name': self.first_name + ' ' +self.last_name,
        'title': self.title,
        'email': self.email,
        'phone': self.phone,
        'role':role
      }

#DONE
#? el owner 8er el user?
class Owner(db.Model):
  __tablename__ = 'owner'
  id = Column(Integer, primary_key = True)
  name = Column(String, unique = True)
                                  #className,      my_tablename
  #  department_id = db.relationship('Department', backref='owner', lazy=True)
                                                # tablename
  department_id = Column(Integer, db.ForeignKey('department.id'), nullable = False) 

  active = Column(Boolean, nullable = False, default = True)

                              #className,      my_tablename
  iec_dep_types = db.relationship('IEC_Dep_Type', backref='owner', lazy=True)

  def __init__(self,name,department):
    self.name = name
    self.department = department

    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'department':self.department.format(),
      'key': self.id,
      'value': self.name,
      'text': self.name
    }

#DONE
class Supplier(db.Model):
  __tablename__ = 'supplier'
  id = Column(Integer, primary_key = True)
  name = Column(String, unique = True)

                       #className,      my_tablename
  PRs = db.relationship('Procurement_Request', backref='supplier', lazy=True)
  
  active = Column(Boolean, nullable = False, default = True)

  def __init__(self,name):
    self.name = name

    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'key': self.id,
      'value': self.name,
      'text': self.name
    }

#DONE_2
class Department(db.Model):
  __tablename__ = 'department'

  id = Column(Integer, primary_key=True, autoincrement = True)
  name = Column(String, unique=True)

  cost_center_id = Column(Integer, db.ForeignKey('cost_center.id'), nullable = False)
                        #className,      my_tablename
  owners = db.relationship('Owner', backref='department', lazy=True)

  active = Column(Boolean, nullable=False, default=True)

  def __init__(self,name, cost_center):
    # print("cost center f constructor el dep:")
    # print(cost_center.format())
    self.name = name
    self.cost_center = cost_center

    self.active = True

  def insert(self):
    db.session.add(self)
    db.session.commit()

  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.commit()

  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'cost_center': self.cost_center.format(),
      'key': self.id,
      'value': self.name,
      'text': self.name
    }

#DONE
class Foreign_Currency(db.Model):
  __tablename__ = 'foreign_currency'
  id = Column(Integer, primary_key=True, autoincrement = True)
  name = Column(String, nullable=False)
  rate_to_egp = Column(Float, nullable=False)

                              #className,      my_tablename
  iec_dep_types = db.relationship('IEC_Dep_Type', backref='foreign_currency', lazy=True)

  active = Column(Boolean, nullable = False, default = True)

  def __init__(self,name,rate):
    self.name = name
    self.rate_to_egp = rate

    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'rate_to_egp':self.rate_to_egp,
      'key': self.id,
      'value': self.name,
      'text': self.name
    }

#DONE
class Status(db.Model):
  __tablename__ = 'status'
  id = Column(Integer, primary_key=True, autoincrement = True)
  name = Column(String, nullable=False)

                        #className,   my_tablename
  iecs = db.relationship('IEC', backref='status', lazy=True)
  POs = db.relationship('Procurement_Order', backref='status', lazy=True)
  PRs = db.relationship('Procurement_Request', backref='status', lazy=True)

  active = Column(Boolean, nullable = False, default = True)

  def __init__(self,name):
    self.name = name
    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'key': self.id,
      'value': self.name,
      'text': self.name,
    }

#DONE
class Cost_Center(db.Model):
  __tablename__ = 'cost_center'

  id = Column(Integer, primary_key=True, autoincrement = True)
  cost_center = Column(String, nullable=False)

                        #className,   my_tablename
  departments = db.relationship('Department', backref='cost_center', lazy=True)
  active = Column(Boolean, nullable = False, default = True)

  def __init__(self, cost_center):
      self.cost_center = cost_center
      self.active = True

  def insert(self):
    db.session.add(self)
    db.session.commit()
    # print(" after inserting cost center >> ", self.id)
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'cost_center': self.cost_center,
      'key': self.id,
      'value': self.cost_center,
      'text': self.cost_center
    }

#DONE
class Capex_Budget_Lines(db.Model):
  __tablename__ = 'capex_budget_lines'

  id = Column(Integer, primary_key=True, autoincrement = True)
  code = Column(String, nullable=False)
  total_amount = Column(Float, nullable=False)

  active = Column(Boolean, nullable = False, default = True)

  def __init__(self, code, total_amount):
      self.code = code
      self.total_amount = total_amount
      self.active = True

  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'code': self.code,
      'total_amount': self.total_amount,
      'key': self.id,
      'value': self.code,
      'text': self.code
    }

#DONE
class Opex_Account_lines(db.Model):
  __tablename__ = 'opex_account_lines'

  id = Column(Integer, primary_key=True, autoincrement = True)
  code = Column(String, nullable=False)
  name = Column(String, nullable=False)
  amount = Column(Float, nullable=True)  

  active = Column(Boolean, nullable = False, default = True)

  def __init__(self, name, code, amount):
      self.name = name
      self.code = code
      self.amount = amount
      self.active = True


  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'code': self.code,
      'name': self.name,
      'amount': self.total_amount,
      #! return code or name???
      # 'key': self.id,
      # 'value': self.name,
      # 'text': self.name,

      # 'value': self.code,
      # 'text': self.code
    }

#DONE
class Product_Type(db.Model):
  __tablename__ = 'product_type'
  id = Column(Integer, primary_key=True, autoincrement = True)
  name = Column(String, nullable=False)

  active = Column(Boolean, nullable = False, default = True)

                      #className,      my_tablename
  iecs = db.relationship('IEC_Dep_Type', backref='product_type', lazy=True)

  def __init__(self,name):
    self.name = name
    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'key': self.id,
      'value': self.name,
      'text': self.name
    }

#DONE
class Supply_Chain_Feedback(db.Model):
  __tablename__ = 'supply_chain_feedback'
  id = Column(Integer, primary_key=True, autoincrement = True)
  name = Column(String, nullable=False)

  active = Column(Boolean, nullable = False, default = True)

                      #className,      my_tablename
  iecs = db.relationship('IEC', backref='supply_chain_feedback', lazy=True)

  def __init__(self,name):
    self.name = name
    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'key': self.id,
      'value': self.name,
      'text': self.name,
    }

#DONE
class Procurement_Feedback(db.Model):
  __tablename__ = 'procurement_feedback'
  id = Column(Integer, primary_key=True, autoincrement = True)
  name = Column(String, nullable=False)

  active = Column(Boolean, nullable = False, default = True)

                      #className,      my_tablename
  iecs = db.relationship('IEC', backref='procurement_feedback', lazy=True)

  def __init__(self,name):
    self.name = name
    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'key': self.id,
      'value': self.name,
      'text': self.name,
    }

#DONE
class Decision_Support_Feedback(db.Model):
  __tablename__ = 'decision_support_feedback'
  id = Column(Integer, primary_key=True, autoincrement = True)
  name = Column(String, nullable=False)

  active = Column(Boolean, nullable = False, default = True)

                      #className,      my_tablename
  iecs = db.relationship('IEC', backref='decision_support_feedback', lazy=True)

  def __init__(self,name):
    self.name = name
    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()
  
  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'key': self.id,
      'value': self.name,
      'text': self.name,
    }

#DONE
class IEC(db.Model):
  __tablename__ = 'iec'

  id = Column(Integer, primary_key = True)
  project_title = Column(String, nullable = False)
  project_description = Column(String, nullable = False)
  justification = Column(String, nullable = False)
  request_date = Column(DateTime, nullable = False)
  start_date = Column(DateTime, nullable = True)
  iec_date = Column(DateTime, nullable = True)
  
  #? Find a way to return this field in .format()
  #! DON'T FORGET TO MODIFY THIS COLUMN TO BE: nullable = False
  # attachment = Column(LargeBinary, nullable = False)
  attachment = Column(LargeBinary, nullable = True)
  #! How about just saving the attachment's name??
  #! and when the client needs to download it, I will make a request to download it
  # attachment_name = Column(String, nullable = False)
  # attachment_name = Column(String, nullable = True)

  finance_number = Column(Integer, nullable = False)
  comment = Column(String, nullable = False)
  supply_chain_feedback_detailed = Column(String, nullable = True)
  procurement_feedback_detailed = Column(String, nullable = True)
  decision_support_feedback_detailed = Column(String, nullable = True)

  capex_egp = Column(Float, nullable=True)
  opex_egp = Column(Float, nullable=True)
  total_egp = Column(Float, nullable=True)

                                          # tablename
  
  status_id = Column(Integer, db.ForeignKey('status.id'), nullable = False)
  # product_type_id = Column(Integer, db.ForeignKey('product_type.id'), nullable = False)
  supply_chain_feedback_id = Column(Integer, db.ForeignKey('supply_chain_feedback.id'), nullable = False)
  procurement_feedback_id = Column(Integer, db.ForeignKey('procurement_feedback.id'), nullable = False)
  decision_support_feedback_id = Column(Integer, db.ForeignKey('decision_support_feedback.id'), nullable = False)

  #? What are the default values ??
  is_annual = Column(Boolean, nullable=False, default=False)
  number_of_years = Column(Integer, nullable=False, default=0)

                              #className,      my_tablename
  iec_dep_types = db.relationship('IEC_Dep_Type', backref='iec', lazy=True)
  POs = db.relationship('Procurement_Order', backref='iec', lazy=True)
  PRs = db.relationship('Procurement_Request', backref='iec', lazy=True)

  active = Column(Boolean, nullable = False, default = True)

  def __init__(self,project_title,project_description,justification,request_date,comment,
                finance_number,status,
                attachment,
                # attachment_name,
                    # product_type,
                    supply_chain_feedback,procurement_feedback,
                    decision_support_feedback,is_annual,number_of_years):

    self.project_title = project_title
    self.project_description = project_description
    self.justification = justification
    self.request_date = request_date
    self.comment = comment
    self.attachment = attachment
    # self.attachment_name = attachment_name
    self.finance_number = finance_number
    self.status = status
    # self.product_type = product_type
    self.supply_chain_feedback = supply_chain_feedback
    self.procurement_feedback = procurement_feedback
    self.decision_support_feedback = decision_support_feedback
    self.is_annual = is_annual
    self.number_of_years = number_of_years
    self.total_egp = 0
    self.opex_egp = 0
    self.capex_egp = 0

    self.active = True
  
  def insert(self):
    db.session.add(self)
    db.session.commit()
  
  def update(self):
    # self.total_egp = self.capex_egp + self.opex_egp
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()

  def format(self):
    # print("\n\nel mafrod yrg3:")
    # print("'TECH_' + str(self.id)")
    # print("TECH_" + str(self.id))
    
    # print("'IEC_ + str(self.finance_number)")
    # print("IEC_" + str(self.finance_number))

    if self.iec_date == None:
      self.iec_date = date.min

    if self.start_date == None:
      self.start_date = date.min

    if self.request_date == None:
      self.request_date = date.min

    
    # print("\n\n\ntype of request date")
    # print(type(self.request_date))
    
    # print("\n\n\ntype of start_date")
    # print(type(self.start_date))
    
    # print("\n\n\ntype of iec_date")
    # print(type(self.iec_date))
    
    # print("\n\n\niec_date")
    # print(type(self.iec_date.date()))

    
  


    return {
      'id': self.id,
      'tech_number': "TECH_" + str(self.id),
      'project_title': self.project_title,
      'project_description': self.project_description,
      'justification': self.justification,
      'request_date':self.request_date,
      'comment':self.comment,
      #!needs to be checked
      'attachment_name':self.attachment_name,

      'finance_number': "IEC_" + str(self.finance_number),
      'status':self.status.format(),
      # 'product_type':self.product_type.format(),
      'supply_chain_feedback_detailed':self.supply_chain_feedback_detailed,
      'supply_chain_feedback':self.supply_chain_feedback.format(),
      'procurement_feedback_detailed':self.procurement_feedback_detailed,
      'procurement_feedback':self.procurement_feedback.format(),
      'decision_support_feedback_detailed':self.decision_support_feedback_detailed,
      'decision_support_feedback':self.decision_support_feedback.format(),
      'capex_egp':str(self.capex_egp), #!el currency eh + self.foreign_currency.format()['name'],
      'opex_egp':str(self.opex_egp), #!el currency eh + self.foreign_currency.format()['name'],
      
      'total_egp':str(self.total_egp), #!el currency eh + self.foreign_currency.format()['name'],
      'is_annual':self.is_annual,
      'number_of_years':self.number_of_years,
      'start_date':self.start_date,
      'iec_date':self.iec_date,

      'active':self.active
    }

#DONE
class IEC_Dep_Type(db.Model):
  __tablename__ = 'iec_dep_type'

  id = Column(Integer, primary_key = True)
  description = Column(String, nullable = False)
  final_rate = Column(Float, default=0.0, nullable=True)
  is_foreign_currency = Column(Boolean, nullable=False, default=False)

  #? What are the default values ??
  is_capex = Column(Boolean, nullable=False, default=False)
  capex_egp = Column(Float, nullable=True)

  is_opex = Column(Boolean, nullable=False, default=False)
  opex_egp = Column(Float, nullable=True)
  total = Column(Float, nullable=True)

                                          # tablename
  iec_id = Column(Integer, db.ForeignKey('iec.id'), nullable = False)
  foreign_currency_id = Column(Integer, db.ForeignKey('foreign_currency.id'), nullable = False)
  owner_id = Column(Integer, db.ForeignKey('owner.id'), nullable = True)
  product_type_id = Column(Integer, db.ForeignKey('product_type.id'), nullable = False)
  
  need_realocation_PR = Column(Boolean, nullable = False, default = True)
  need_realocation_PO = Column(Boolean, nullable = False, default = True)
  
  active = Column(Boolean, nullable = False, default = True)

  def __init__(self, item_description, is_foreign_currency, is_capex, is_opex, iec, product_type,
               need_realocation_PR, need_realocation_PO, foreign_currency,  capex_egp, opex_egp):

    self.description = item_description
    self.is_foreign_currency = is_foreign_currency
    self.is_capex = is_capex
    self.is_opex = is_opex
    self.need_realocation_PR = need_realocation_PR
    self.need_realocation_PO = need_realocation_PO
    self.iec = iec
    self.product_type = product_type
    self.foreign_currency = foreign_currency
    self.final_rate = foreign_currency.rate_to_egp
    # self.owner = owner
    self.opex_egp = opex_egp
    self.capex_egp = capex_egp
    self.total_egp = capex_egp + opex_egp

    self.active = True
  
  def insert(self):
    # print("El default values in IEC_Dep_Type el mafroood:")
    # print(self.capex_egp)
    # print(self.opex_egp)
    # print(self.total_egp)

    self.total_egp = self.capex_egp + self.opex_egp

    #get the parent and update its capex, opex and total
    parent_iec = db.session.query(IEC).filter(IEC.id == self.iec.id).first()
    # print("el parent f IEC_Dep_Type, parent_iec:")
    # print(parent_iec)
    parent_iec.capex_egp = parent_iec.capex_egp + self.capex_egp
    parent_iec.opex_egp = parent_iec.opex_egp + self.opex_egp
    parent_iec.total_egp = parent_iec.total_egp + self.total_egp

    parent_iec.update()

    db.session.add(self)
    db.session.commit()
  
  def update(self):
    db.session.commit()

  def delete(self):

    #get the parent and update its capex, opex and total
    parent_iec = db.session.query(IEC).filter(IEC.id == self.iec_id).first()
    parent_iec.capex_egp = parent_iec.capex_egp - self.capex_egp
    parent_iec.opex_egp = parent_iec.opex_egp - self.opex_egp
    parent_iec.total_egp = parent_iec.total_egp - self.total_egp

    db.session.delete(self)
    db.session.commit()
  
  def deactivate(self):
    self.active = False
    db.session.commit()


#? el returned capex w opex multiplied by el rate?
  def format(self):
    
    return {
      'id': self.id,
      'description': self.description,
      'final_rate':self.final_rate,
      'is_foreign_currency':self.is_foreign_currency,
      'is_capex':self.is_capex,
      'is_opex':self.is_opex,
      'capex_egp':str(self.capex_egp),# + ' '+ self.foreign_currency.format()['name'],
      'opex_egp':str(self.opex_egp),# + ' ' + self.foreign_currency.format()['name'],
      'need_realocation_PR': self.need_realocation_PR,
      'need_realocation_PO': self.need_realocation_PO,
      # 'total':str(self.total) + ' ' + self.foreign_currency.format()['name'],
      'iec':self.iec.format(),
      'foreign_currency':self.foreign_currency.format(),
      # 'owner': self.owner.format(),
      'product_type': self.product_type.format(),

      'active':self.active
    }


class Procurement_Order(db.Model):
  __tablename__ = 'procurement_order'

  id = Column(Integer, primary_key=True)
  comment = Column(String, nullable = False)
  date = Column(DateTime, nullable=False)
                                          # tablename
  status_id = Column(Integer, db.ForeignKey('status.id'), nullable = False)
  iec_id = Column(Integer, db.ForeignKey('iec.id'), nullable = False)
  #! what is oracle id??
  # oracle_id = Column(Integer, db.ForeignKey('.id'), nullable = False)

  active = Column(Boolean, nullable=False, default=True)

  def __init__(self, comment, date, status,iec):#,oracle):
    self.comment = comment
    self.date = date
    self.status = status
    self.iec = iec
    # self.oracle = oracle

    self.active = True

  def insert(self):
    db.session.add(self)
    db.session.commit()

  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def deactivate(self):
    self.active = False
    db.session.commit()

  def format(self):
    return{
      'id':self.id,
      'comment':self.comment,
      'date':self.date,
      'iec':self.iec.format(),
      'status':self.status.format(),
      'active':self.active,

      # 'key': self.id,
      # 'value': self.comment,
      # 'text': self.comment
    }


class Procurement_Request(db.Model):
  __tablename__ = 'procurement_request'

  id = Column(Integer, primary_key=True)
  comment = Column(String, nullable = False)
  date = Column(DateTime, nullable=False)
                                          # tablename
  status_id = Column(Integer, db.ForeignKey('status.id'), nullable = False)
  iec_id = Column(Integer, db.ForeignKey('iec.id'), nullable = False)
  supplier_id = Column(Integer, db.ForeignKey('supplier.id'), nullable = False)

  # add parent class: iec item

  #! what is oracle id?? add it k input msh related b table
  # oracle_id = Column(Integer, db.ForeignKey('.id'), nullable = False)

  active = Column(Boolean, nullable=False, default=True)

  def __init__(self, comment, date, status, iec, supplier):#,oracle):
    self.comment = comment
    self.date = date
    self.status = status
    self.iec = iec
    self.supplier = supplier
    # self.oracle = oracle

    self.active = True

  def insert(self):
    db.session.add(self)
    db.session.commit()

  def update(self):
    db.session.commit()

  def delete(self):
    db.session.delete(self)
    db.session.commit()

  def deactivate(self):
    self.active = False
    db.session.commit()

  def format(self):
    return{
      'id':self.id,
      'comment':self.comment,
      'date':self.date,
      'iec':self.iec.format(),
      'status':self.status.format(),
      'supplier':self.supplier.format(),
      'active':self.active,

      # 'key': self.id,
      # 'value': self.comment,
      # 'text': self.comment
    }

setup_db(app)

# if __name__ == '__main__':
#   app.run()