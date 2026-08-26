from ..schemas import PostCreate ,ResponsePost , PostOut
from fastapi import Response, status, HTTPException,Depends, APIRouter

from ..database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models
from typing import List,Optional
from .. import auth2

router = APIRouter(
    prefix="/posts",
    tags=['Posts']
)

def find_post(id: int):
    for post in my_posts:
        if post["id"] == id:
            return post

my_posts = [{"title": "post 1", "content": "content of post 1", "id": 1},
            {"title": "post 2", "content": "content of post 2", "id": 2}]

def find_index_post(id: int):
    for i, post in enumerate(my_posts):
        if post['id'] == id:
            return i







@router.get('/{id}', response_model=List[ResponsePost])
def get_post(id: int, db : Session = Depends(get_db),user_id: int = Depends(auth2.get_current_user)):
    # cursor.execute("""SELECT * FROM posts WHERE id = %s""",(str(id),))
    # post = cursor.fetchone()
    post = db.query(models.Post).filter(models.Post.id == id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                             detail=f"post with id: {id} was not found")
    return post

@router.delete('/{id}')
def delete_post(id: int, db: Session = Depends(get_db),current_user: int = Depends(auth2.get_current_user)):
    # cursor.execute("""DELETE FROM posts WHERE ID = %s RETURNING *""",(str(id),))
    # deleted_post = cursor.fetchone()
    # conn.commit()

    deleted_post = db.query(models.Post).filter(models.Post.id == id).first()
    db.delete(deleted_post)
    db.commit()


    if id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Not authorized to perform requested action")

    if not deleted_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"post with id: {id} does not exist")
    my_posts.pop(find_index_post(id))
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put('/{id}', response_model=ResponsePost)
def update_post(id: int, updated_post: PostCreate,db: Session = Depends(get_db),current_user: int = Depends(auth2.get_current_user)):
    # cursor.execute("""UPDATE posts SET title = %s, content = %s, published = %s WHERE id = %s RETURNING *"""
    #                ,(updated_post.title, updated_post.content, updated_post.published, str(id),))
    # updated_post = cursor.fetchone()
    # conn.commit()
    post_query = db.query(models.Post).filter(models.Post.id == id)
    post = post_query.first()

    if id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Not authorized to perform requested action")
    


    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"post with id: {id} does not exist")
    post_query.update(updated_post.model_dump())
    db.commit()
   
    
    return updated_post





@router.get('/', response_model=List[PostOut])
def get_posts(db: Session = Depends(get_db),Limit: int = 10,skip :int = 0,search: Optional[str]=''):
    #cursor.execute("""SELECT * FROM posts""")
    #posts = cursor.fetchall()
    results = db.query(models.Post, func.count(models.Vote.post_id).label("votes")).join(
        models.Vote, models.Vote.post_id == models.Post.id , isouter = True
        ).filter(models.Post.title.contains(search)).group_by(models.Post.id).limit(Limit).offset(skip).all()
    return [{"Post": post, "votes": votes} for post, votes in results]


@router.post('/',status_code=status.HTTP_201_CREATED, response_model=ResponsePost)
def create_post(new_post: PostCreate, db : Session = Depends(get_db),current_user: int = Depends(auth2.get_current_user)):
    # cursor.execute(""" INSERT INTO posts (title,content,published) VALUES (%s,%s,%s) RETURNING *"""
    #                ,(new_post.title,new_post.content,new_post.published))
    # new_post = cursor.fetchone()
    # conn.commit()
    # return {'message': 'Post created successfully'}
    print(type(current_user.id))

    neww_post = models.Post(user_id=current_user.id, **new_post.model_dump())
    db.add(neww_post)
    db.commit()
    db.refresh(neww_post)
    return neww_post


