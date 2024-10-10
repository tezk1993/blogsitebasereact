import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { auth, db } from '../firebase';
import { PostPreview } from '../Components/PostPreview';
import { Pagination } from '../Components/Pagination';


export const Home = ({isAuth}) => {
    const [posts, setPosts] = useState();
    const [currentPosts, setCurrentPosts] = useState();

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(2);


    const getPosts = async () =>{
      
      setLoading(true);
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("created_at", "desc"));
      const data = await getDocs(q);
      const postData = data.docs.map((doc) => ({...doc.data(),id:doc.id}));
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;

      console.log(postData);
      setPosts(postData);
      setCurrentPosts(postData.slice(indexOfFirstPost, indexOfLastPost))
      setLoading(false);

    };

    useEffect(() => {
      getPosts();
    }, [currentPage]);


    const paginate = (pageNumber) =>{
      setCurrentPage(pageNumber)
    };
    // Change page

  return (
    
    <div class="flex flex-col items-center w-full">
      {loading ? 
        <>
        </>
        :
        
        <>        

        {currentPosts.map((post) => {
          return  (
              <div>
                  <PostPreview 
                    authorID={post.author.id}
                    authorName={post.author.name} 
                    authorImage={post.author.image}
                    date={new Date(post.created_at.seconds * 1000).toLocaleDateString()}
                    title={post.title}
                    subtitle={post.subtitle}
                    summary={post.summary}
                    comments={post.comments.length}
                    postImage={post.featured_image}
                    id={post.id}
                    />
              </div>
            )
            
        })}
        <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} currentPage={currentPage} paginate={paginate} />
        </>
      }
    </div>
   
  )
}
