import React from 'react'
import { Menu } from 'semantic-ui-react'
import '../../StyleSheets/Header.css';
import { useHistory } from 'react-router-dom';



export const LogoutButton = (props) =>{
    /*const navTo = (uri) =>{
        window.location.href = window.location.origin + uri;
      }*/
    let history = useHistory();
    let logout = ()=> {
        sessionStorage.removeItem("access_token")
        props.setToken(null)
        history.push('/');
    }
    return(
        <React.Fragment>
            <Menu.Item
            className='menu_item'
            name='Logout'
            position='right'
            onClick={()=>logout()}
            >
                sign out
            </Menu.Item>
        </React.Fragment>
    )
}