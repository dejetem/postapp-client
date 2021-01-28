import React,{useState} from 'react'
import { gql, useMutation} from "@apollo/client";
import { Button, Form } from 'semantic-ui-react'
import {useForm} from '../util/hook'
import {FETCH_POSTS_QUERY} from '../util/grahpql';

function PostForm() {
    const [errors, setErrors] = useState({})
    const {values, onChange, onSubmit} = useForm(createPostCallback, {
        body: ''
    });

    const [ createPost, {error} ] = useMutation(CREATE_POST_MUTATION, {
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
         },
        variables: values,
        update(proxy, result){
           const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            /*data.getPosts = [result.data.createPost, ...data.getPosts]
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
            */
            let newData = [...data.getPosts];
            newData = [result.data.createPost, ...newData];
            proxy.writeQuery({
              query: FETCH_POSTS_QUERY,
              data: {
                ...data,
                getPosts: {
                   newData,
                },
              },
           });
            values.body = ''
        }
    })
    function createPostCallback() {
        createPost();
    }
    return (
        <>
           <Form onSubmit={onSubmit}>
            <h2>New Post:</h2>
            <Form.Field>
                <Form.Input
                   placeholder='My World'
                   name='body'
                   onChange={onChange}
                   value={values.body}
                   error={error ? true : false}
                />
                <Button type='submit' color='teal'>
                    Post
                </Button>
            </Form.Field>
            </Form>
            {error && (
               <div className='ui error message' style={{marginBottom: 20}}>
                 <ul className='list'>
                     <li>{error.graphQLErrors[0].message}</li>
                 </ul>
               </div>
            )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
   mutation createPost($body: String!){
       createPost(body: $body){
           id body createdAt username
           likes{
               id username createdAt
           }
           likeCount
           comments{
               id body username createdAt
           }
           commentCount
       }
   }
`

export default PostForm;