import React,{useState} from 'react';
import {
  Route,
  Switch,
  useHistory
} from 'react-router-dom';
import { isExpired, decodeToken } from "react-jwt";
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute';
import $ from 'jquery';

import LoginRegisteration from './Component/LoginRegisteration';
import {Header} from './Component/Headers/Header';
// import SiteList from './Component/SiteList/SiteList';
// import SiteListEdit from './Component/SiteList/SiteListEdit';
// import IntegratedSites from'./Component/IntegratedSites/IntegratedSites';
// import SignedSites from'./Component/SignedSites/SignedSites';
// import Project from './Component/Project/Project';
// import ProjectEdit from './Component/Project/ProjectEdit';
// import ProjectTargetTechEdit from './Component/Project/ProjectTargetTechEdit';
// import ProjectTargetEdit from './Component/Project/ProjectTargetEdit';
import Dashboard from './Component/Dashboard/Dashboard';
// import Area from './Component/Area/Area';
// import AreaEdit from './Component/Area/AreaEdit';
// import Accountability from './Component/Accountability/Accountability';
// import AccountabilityEdit from './Component/Accountability/AccountabilityEdit';
// import Vendor from './Component/Vendor/Vendor';
// import VendorEdit from './Component/Vendor/VendorEdit';
// import Technology from './Component/Technology/Technology';
// import TechnologyEdit from './Component/Technology/TechnologyEdit';
import Home from './Component/Home';
import SelfUserEdit from './Component/SelfUserEdit/SelfUserEdit';
import User from './Component/User/User';
import UserEdit from './Component/User/UserEdit';
// NEW
import Iec from "./Component/Iec/Iec";
import IecEdit from "./Component/Iec/IecEdit";
import IecItem from "./Component/IecItem/IecItem";
import IecItemEdit from "./Component/IecItem/IecItemEdit";
import IecType from "./Component/IecType/IecType";
import IecTypeEdit from "./Component/IecType/IecTypeEdit";
import Supplier from "./Component/Supplier/Supplier";
import SupplierEdit from "./Component/Supplier/SupplierEdit";
import Owner from "./Component/Owner/Owner";
import OwnerEdit from "./Component/Owner/OwnerEdit";
import Department from "./Component/Department/Department";
import DepartmentEdit from "./Component/Department/DepartmentEdit";
import Status from "./Component/Status/Status";
import StatusEdit from "./Component/Status/StatusEdit";
import ForeignCurrency from "./Component/ForeignCurrency/ForeignCurrency";
import ForeignCurrencyEdit from "./Component/ForeignCurrency/ForeignCurrencyEdit";
import ProcurementFeedback from "./Component/ProcurementFeedback/ProcurementFeedback";
import ProcurementFeedbackEdit from "./Component/ProcurementFeedback/ProcurementFeedbackEdit";
import SupplyChainFeedback from "./Component/SupplyChainFeedback/SupplyChainFeedback";
import SupplyChainFeedbackEdit from "./Component/SupplyChainFeedback/SupplyChainFeedbackEdit";
import DecisionSupportFeedback from "./Component/DecisionSupportFeedback/DecisionSupportFeedback";
import DecisionSupportFeedbackEdit from "./Component/DecisionSupportFeedback/DecisionSupportFeedbackEdit";


function App() {
  let [token,setToken] = useState(sessionStorage.getItem("access_token"));
  let history = useHistory();
  let [prevAuth,setPrevAuth] = useState(0);

  function refreshToken(){
    if(isExpired(sessionStorage.getItem("access_token"))){
      $.ajax({
        url: `/api-iec/refresh`, //TODO: update request URL
        type: "POST",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("refresh_token"));
        },
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
        }),
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: (result) => {
          sessionStorage.setItem("access_token",result.access_token);
          return;
        },
        error: (error) => {
          sessionStorage.removeItem("access_token")
          sessionStorage.removeItem("refresh_token")
          setToken(null)
          history.push('/api-iec/logins')
          return;
        }
      });
    }
    
  }

  console.log("Ana f App.js, el mafrod 3shan Dashboard is clicked!!!")

  return (
    <div className="App">
      <Header id='header' token={token} setToken={setToken} path />
      <Switch> 

          {/* NEW */}
          <ProtectedRoute path="/iec" exact component={Iec} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/iec/:id" exact component={IecEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/iecItem" exact component={IecItem} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/iecItem/:id" exact component={IecItemEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>      
          <ProtectedRoute path="/iecType" exact component={IecType} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/iecType/:id" exact component={IecTypeEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>    

          <ProtectedRoute path="/PO" exact component={Iec} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/PO/:id" exact component={IecEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/PR" exact component={Iec} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/PR/:id" exact component={IecEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>  
          
          <ProtectedRoute path="/suppliers" exact component={Supplier} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/suppliers/:id" exact component={SupplierEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/owners" exact component={Owner} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/owners/:id" exact component={OwnerEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/departments" exact component={Department} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/departments/:id" exact component={DepartmentEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/status" exact component={Status} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/status/:id" exact component={StatusEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/foreignCurrencies" exact component={ForeignCurrency} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/foreignCurrencies/:id" exact component={ForeignCurrencyEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>

          <ProtectedRoute path="/supplyChainFeedback" exact component={SupplyChainFeedback} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/supplyChainFeedback/:id" exact component={SupplyChainFeedbackEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>

          <ProtectedRoute path="/procurementFeedback" exact component={ProcurementFeedback} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/procurementFeedback/:id" exact component={ProcurementFeedbackEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/decisionSupportFeedback" exact component={DecisionSupportFeedback} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/decisionSupportFeedback/:id" exact component={DecisionSupportFeedbackEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>

          <ProtectedRoute path="/dashboard" exact component={Dashboard} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>

          <Route exact path="/logins" >
            <LoginRegisteration token={token} setToken={setToken} history={history}/>
          </Route>
          
          <ProtectedRoute path="/self-edit/:id" exact component={SelfUserEdit} prevAuth={prevAuth} requiredAuth={1} refreshToken ={refreshToken.bind(this)} history={history}/>
          
          <ProtectedRoute path="/users" exact component={User} prevAuth={prevAuth} requiredAuth={4} refreshToken ={refreshToken.bind(this)} history={history}/>
          <ProtectedRoute path="/users/:id" exact component={UserEdit} prevAuth={prevAuth} requiredAuth={4} refreshToken ={refreshToken.bind(this)} history={history}/>
          
          <Route path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
