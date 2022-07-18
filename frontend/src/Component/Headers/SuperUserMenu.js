import React, { useState } from 'react'
import { Dropdown, Menu, Icon, Image } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
import $ from 'jquery';
import no_profile_picture from '../../media/no_profile_picture.png';
import { Link } from 'react-router-dom';


export const SuperUserMenu = (props) =>{
    //const [activeItem, setActiveItem] = useState('Home');
    const [firstName, setFirstName] = useState('');
    const [imageURL, setImageURL] = useState(no_profile_picture);

    $.ajax({
        
        url: `/api-iec/users/${props.user_id}`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        success: (result) => {
            setFirstName(result.user.first_name) 
            return ;
        },
        error: (error) => {
            console.log("EL error f el response in SuperUserMenu.js in /api-iec/users/id:")
            console.log(error)
          alert('Unable to load username. Please try your request again')
          return;
        }
    })
    $.ajax({
        url: `/api-iec/users/${props.user_id}/uploads`, //TODO: update request URL
        type: "GET",
        beforeSend: function (xhr) {   //Include the bearer token in header
          xhr.setRequestHeader("Authorization", 'Bearer '+ sessionStorage.getItem("access_token"));
        },
        processData: false,
        contentType: false,
        cache: false,
        timeout: 800000,
                      
        success: (result) => {
            setImageURL(`data:image/jpeg;base64,${result}`)
          return;
        },
        error: (error) => {
          setImageURL(no_profile_picture)
          return;
        }
      })

      const iec_trigger = (
        <span>
          <Icon name="file alternate" /> IECs
        </span>
      );

      const settings_trigger = (
        <span>
          <Icon name='settings' /> Settings
        </span>
      )

    return (
      <React.Fragment>
        <Menu
          id="menu_2_id"
          widths={4}
          size="mini"
          fluid={true}
          inverted={true}
        >
          <Menu.Item className="menu_2_item" name="Home" as={Link} to={"/"}>
            Home
          </Menu.Item>

          {/* tab el IECs */}
          <Dropdown className="menu_2_item" item trigger={iec_trigger}>
            <Dropdown.Menu>
              <Dropdown.Item
                icon="file alternate"
                text="IEC"
                as={Link}
                to={"/iec"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="file alternate"
                text="PO"
                as={Link}
                to={"/iecItem"}
              />
              <Dropdown.Item
                icon="file alternate"
                text="PR"
                as={Link}
                to={"/iecItem"}
              />
              <Dropdown.Item
                icon="chart line"
                text="Dashboard"
                as={Link}
                to={"/dashboard"}
                // onClick={()=>console.log("Dashboard Clicked mn el super user!")}
                //onClick={() => {navTo('/projects')}}
              />
            </Dropdown.Menu>
          </Dropdown>

          {/* tab el settings */}
          <Dropdown className="menu_2_item" item trigger={settings_trigger}>
            <Dropdown.Menu>
              <Dropdown.Item icon="user" text="Users" as={Link} to={"/users"} />
              <Dropdown.Item
                icon="shop"
                text="Suppliers"
                as={Link}
                to={"/suppliers"}
              />
              {/* <Dropdown.Item
                icon="handshake"
                text="Vendors"
                as={Link}
                to={"/vendors"}
              /> */}
              <Dropdown.Item
                icon="users"
                text="Owners"
                as={Link}
                to={"/owners"}
              />
              <Dropdown.Item
                icon="users"
                text="Departments"
                as={Link}
                to={"/departments"}
              />
              <Dropdown.Item
                icon="users"
                text="Status"
                as={Link}
                to={"/status"}
              />
              <Dropdown.Item
                icon="file alternate"
                text="IEC Type"
                as={Link}
                to={"/iecType"}
              />
              <Dropdown.Item
                icon="currency"
                text="Foreign Currencies"
                as={Link}
                to={"/foreignCurrencies"}
              />

              <Dropdown.Item
                icon="thumbs up"
                text="Supply Chain Feedback"
                as={Link}
                to={"/supplyChainFeedback"}
              />

              <Dropdown.Item
                icon="thumbs up"
                text="Procurement Feedback"
                as={Link}
                to={"/procurementFeedback"}
              />

              <Dropdown.Item
                icon="thumbs up"
                text="Decision Support Feedback"
                as={Link}
                to={"/decisionSupportFeedback"}
              />
            </Dropdown.Menu>
          </Dropdown>

          {/* tab el profile */}
          <Menu.Item
            className="menu_2_item"
            name="users"
            as={Link}
            to={`/self-edit/${props.user_id}`}
          >
            <div>
              <Image src={imageURL} avatar />
              <span>{firstName}</span>
            </div>
          </Menu.Item>
        </Menu>
        {/* <Menu
          id="menu_2_id_phone_admin"
          vertical={true}
          widths={2}
          size="mini"
          fluid={true}
          inverted={true}
        >
          <Menu.Item className="menu_2_item" name="Home" as={Link} to={"/"}>
            Home
          </Menu.Item>

          {/* tab el IECs *}
          <Dropdown className="menu_2_item" item trigger={iec_trigger}>
            <Dropdown.Menu>
              <Dropdown.Item
                icon="list layout"
                text="Site List"
                as={Link}
                to={"/sites"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="signal"
                text="Integrated Sites"
                as={Link}
                to={"/integrated-sites"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="check circle outline"
                text="Signed Sites"
                as={Link}
                to={"/signed-sites"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="chart line"
                text="Dashboard"
                as={Link}
                to={"/dashboard"}
                //onClick={() => {navTo('/projects')}}
              />
            </Dropdown.Menu>
          </Dropdown>

          {/* tab el settings *}
          <Dropdown className="menu_2_item" item trigger={settings_trigger}>
            <Dropdown.Menu>
              <Dropdown.Item
                icon="user"
                text="Users"
                as={Link}
                to={"/users"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="map"
                text="Areas"
                as={Link}
                to={"/areas"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="handshake"
                text="Vendors"
                as={Link}
                to={"/vendors"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="signal"
                text="Technologies"
                as={Link}
                to={"/technologies"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="users"
                text="Accountabilities"
                as={Link}
                to={"/accountabilities"}
                //onClick={() => {navTo('/projects')}}
              />
              <Dropdown.Item
                icon="clipboard list"
                text="Projects"
                as={Link}
                to={"/projects"}
                //onClick={() => {navTo('/projects')}}
              />
            </Dropdown.Menu>
          </Dropdown>

          <Menu.Item
            className="menu_2_item"
            name="users"
            as={Link}
            to={`/self-edit/${props.user_id}`}
          >
            <div>
              <Image src={imageURL} avatar />
              <span>{firstName}</span>
            </div>
          </Menu.Item>
        </Menu> */}
      </React.Fragment>
    );
}
