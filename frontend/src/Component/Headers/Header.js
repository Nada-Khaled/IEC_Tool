import React from 'react'
import { Menu,Image } from 'semantic-ui-react'   

import orange_pic from '../../media/orange.png';

import '../../StyleSheets/Header.css';

import {AuthenticationButton} from './AuthenticationButton'
import {LogedInMenuAuth} from './LogedInMenuAuth'
import { Link } from 'react-router-dom';



export const Header = ({token,setToken}) =>{
    
  return (
    <div>
      <div>
        <Menu id='menu_id' widths={2} inverted={true} style={{object_position:"center"}}>
          <Menu.Item
              className='menu_item'
              name='Home'
              as={Link}
              to={'/'}
          >
              <Image className='logo' src={orange_pic} />
          </Menu.Item>
          <AuthenticationButton token ={token} setToken={setToken}/>
        </Menu>
      </div>
      <div>
        <LogedInMenuAuth token ={token} setToken={setToken}/>
      </div>
    </div>
    
    )
  
  }
  

