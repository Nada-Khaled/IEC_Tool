import React from 'react'
import { Menu } from 'semantic-ui-react'
//import '../../stylesheets/Header.css';
import { Link } from 'react-router-dom';


export const LoginButton = () =>{
            
    return(
        <React.Fragment>
            <Menu.Item 
            className='menu_item'
            name='Sign In'
            position='right'
            as={Link}
            to={'/logins'}    
            >
                <div id='sign-in-text'>
                    sign in
                </div>
            </Menu.Item>
        </React.Fragment>
    )
}