export interface UserResponse {
  id: number;
  email: string;
  created_at: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  published: boolean;
  user_id: number;
  user: UserResponse;
}

export interface PostOut {
  Post: PostResponse;
  votes: number;
}

export interface PostCreatePayload {
  title: string;
  content: string;
  published?: boolean;
}

export interface VotePayload {
  post_id: number;
  dir: 1 | 0;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface JWTPayload {
  user_id: number;
  exp: number;
}
