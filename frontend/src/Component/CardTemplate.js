import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import '../StyleSheets/card.css'

const CardTemplate = (props) => (
  <Card id='card-size' as='div'>
    <Image as='img' id='profile-pic' src={props.img} wrapped ui={false} />
    <Card.Content>
      <Card.Header>{props.name}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.role}</span>
      </Card.Meta>
      <Card.Description>
        <Icon name='mail' />
        Email Addresss: {props.email}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <React.Fragment>
        <Icon name='phone' />
        Phone Number: {props.phoneNumber}
      </React.Fragment>
    </Card.Content>
  </Card>
)

export default CardTemplate;