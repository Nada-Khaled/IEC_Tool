import React, { useState } from 'react'
import { Dropdown, Menu, Icon, Image } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
import $ from 'jquery';
import no_profile_picture from '../../media/no_profile_picture.png';
import { Link } from 'react-router-dom';


export const IntegrationEngineerMenu = (props) =>{
    //const [activeItem, setActiveItem] = useState('Home');
    const [firstName, setFirstName] = useState('');
    const [imageURL, setImageURL] = useState(no_profile_picture);

    //const handleItemClick = (e, { name }) => setActiveItem(name)

    /*const navTo = (uri) =>{
        window.location.href = window.location.origin + uri;
    }*/

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

      const integration_trigger = (
        <span>
          <Icon name='sitemap' /> Integration
        </span>
      )

      const settings_trigger = (
        <span>
          <Icon name='settings' /> Settings
        </span>
      )

    return(
        <React.Fragment>
            <Menu id='menu_2_id' widths={4} size='mini' fluid={true} inverted ={true}>    
                <Menu.Item
                    className='menu_2_item'
                    name='Home'
                    as={Link}
                    to={'/'}
                >
                    Home
                </Menu.Item>
                
                <Dropdown className='menu_2_item' item trigger={integration_trigger} >
                    <Dropdown.Menu>
                        <Dropdown.Item icon='list layout' text='Site List' as={Link}
                            to={'/sites'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='signal' text='Integrated Sites' as={Link}
                            to={'/integrated-sites'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='check circle outline' text='Signed Sites' as={Link}
                            to={'/signed-sites'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='chart line' text='Dashboard' as={Link}
                            to={'/dashboard'}
                            //onClick={() => {navTo('/projects')}}
                        />
                    </Dropdown.Menu>
                </Dropdown>
                
                <Dropdown className='menu_2_item' item trigger={settings_trigger} >
                    <Dropdown.Menu>
                        <Dropdown.Item icon='user' text='Users' as={Link}
                            to={'/users'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='map' text='Areas' as={Link}
                            to={'/areas'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='handshake' text='Vendors' as={Link}
                            to={'/vendors'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='signal' text='Technologies' as={Link}
                            to={'/technologies'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='users' text='Accountabilities' as={Link}
                            to={'/accountabilities'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='clipboard list' text='Projects' as={Link}
                            to={'/projects'}
                            //onClick={() => {navTo('/projects')}}
                        />
                    </Dropdown.Menu>
                </Dropdown>

                <Menu.Item
                    className='menu_2_item'
                    name='users'
                    //active={activeItem === 'users'}
                    as={Link}
                    to={`/self-edit/${props.user_id}`}
                    //onClick={() => {handleItemClick()}}
                >
                    <div>
                        <Image src={imageURL} avatar />
                        <span>{firstName}</span>
                    </div>
                    
                </Menu.Item>
            </Menu>
            <Menu id='menu_2_id_phone_admin' vertical={true} widths={2} size='mini' fluid={true} inverted ={true}>    
                <Menu.Item
                    className='menu_2_item'
                    name='Home'
                    as={Link}
                    to={'/'}
                >
                    Home
                </Menu.Item>
                
                <Dropdown className='menu_2_item' item trigger={integration_trigger} >
                    <Dropdown.Menu>
                        <Dropdown.Item icon='list layout' text='Site List' as={Link}
                            to={'/sites'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='signal' text='Integrated Sites' as={Link}
                            to={'/integrated-sites'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='check circle outline' text='Signed Sites' as={Link}
                            to={'/signed-sites'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='chart line' text='Dashboard' as={Link}
                            to={'/dashboard'}
                            //onClick={() => {navTo('/projects')}}
                        />
                    </Dropdown.Menu>
                </Dropdown>
                
                <Dropdown className='menu_2_item' item trigger={settings_trigger} >
                    <Dropdown.Menu>
                        <Dropdown.Item icon='user' text='Users' as={Link}
                            to={'/users'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='map' text='Areas' as={Link}
                            to={'/areas'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='handshake' text='Vendors' as={Link}
                            to={'/vendors'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='signal' text='Technologies' as={Link}
                            to={'/technologies'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='users' text='Accountabilities' as={Link}
                            to={'/accountabilities'}
                            //onClick={() => {navTo('/projects')}}
                        />
                        <Dropdown.Item icon='clipboard list' text='Projects' as={Link}
                            to={'/projects'}
                            //onClick={() => {navTo('/projects')}}
                        />
                    </Dropdown.Menu>
                </Dropdown>
                
                <Menu.Item
                    className='menu_2_item'
                    name='users'
                    //active={activeItem === 'users'}
                    as={Link}
                    to={`/self-edit/${props.user_id}`}
                    //onClick={() => {handleItemClick()}}
                >
                    <div>
                        <Image src={imageURL} avatar />
                        <span>{firstName}</span>
                    </div>
                    
                </Menu.Item>
            </Menu>
        </React.Fragment>
    )
}
/*
<div>
    <Image src={imageURL} avatar />
    <span>{firstName}</span>
</div>
*/

/*
<Image src={imageURL} size='tiny' verticalAlign='middle' />{' '}
<span>{firstName}</span>
*/