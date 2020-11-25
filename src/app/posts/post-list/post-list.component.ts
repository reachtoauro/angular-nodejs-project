import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

    posts: Post[] = [];
    isLoading = false;

    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    private authStatusSub: Subscription;
    userIsAuthenticated;
    userId: string;

    constructor(public postsService: PostsService, private authService: AuthService) { }

    private postsSub = new Subscription;
    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserid();
        this.postsSub = this.postsService.getPostUpdateListner()
            .subscribe((postData: { posts: Post[], postCount: number }) => {
                this.isLoading = false;
                this.posts = postData.posts;
                this.totalPosts = postData.postCount;
            });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserid();
        });
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId)
            .subscribe(() => {
                this.postsService.getPosts(this.postsPerPage, this.currentPage);
            }, () => {
                this.isLoading = false;
            });
    }

    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }
}