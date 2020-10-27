import React from 'react'
import { Button, Icon, Label, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

export default function CommentButton({ commentCount, id}) {
  return (
    <Popup content="Comment on post" inverted trigger={
      <Button labelPosition='right' as={Link} to={`/post/${id}`}>
        <Button color='purple' basic>
          <Icon name='comments' />
        </Button>
        <Label basic color='purple' pointing='left'>
          {commentCount}
        </Label>
      </Button>}
    />
  )
}
