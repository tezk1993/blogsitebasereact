import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { auth, db } from '../../firebase';
import { PostPreview } from '../../Components/PostPreview';

export const Profile = () => {

  let { userID } = useParams();

  const [posts, setPosts] = useState();
  const [loading, setLoading] = useState(true);
  const postsRef = collection(db, "posts");

  const q = query(postsRef, where("author.id", "==", userID));


  const getPosts = async () =>{
    setLoading(true);
    const data = await getDocs(q);
    const postsData = data.docs.map((doc) => ({...doc.data(),id:doc.id}));
    setPosts(postsData);
    setLoading(false);
    console.log(postsData);
  };

  useEffect(() => {
    getPosts();
    console.log(posts);
  }, []);

return (
  
  <div class="flex flex-col items-center w-full">
    {loading ? 
      <>
      </>
      :
      posts.map((post) => {
        return  (
            <div>
                <PostPreview 
                  authorName={post.author.name} 
                  authorImage={post.author.image}
                  date={new Date(post.created_at.seconds * 1000).toLocaleDateString()}
                  title={post.title}
                  subtitle={post.subtitle}
                  summary={post.summary}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  postImage={post.image}
                  id={post.id}
                  />
            </div>
          )
      })
      
    
    }
  </div>
 
)
}
