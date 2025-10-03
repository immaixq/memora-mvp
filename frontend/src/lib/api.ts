import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Prompt {
  id: string;
  title: string;
  body?: string;
  type: 'TEXT' | 'POLL';
  createdAt: string;
  author: User;
  community?: Community;
  pollOptions?: PollOption[];
  responses?: Response[];
  likesCount?: number;
  isLiked?: boolean;
  _count: {
    responses: number;
    likes?: number;
  };
}

export interface Response {
  id: string;
  text: string;
  upvotesCount: number;
  depth: number;
  createdAt: string;
  author: User;
  replies?: Response[];
}

export interface CreateMemoryData {
  title: string;
  body?: string;
  type: 'TEXT' | 'POLL';
  communityId?: string;
  pollOptions?: string[];
}

export interface CreateResponseData {
  promptId: string;
  parentId?: string;
  text: string;
}

// API Functions
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const promptsApi = {
  getPrompts: (params?: { 
    communityId?: string; 
    sort?: 'recent' | 'trending'; 
    page?: number; 
    limit?: number; 
  }) => 
    api.get<{
      prompts: Prompt[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>('/prompts', { params }),

  getPrompt: (id: string) => 
    api.get<Prompt>(`/prompts/${id}`),

  createPrompt: (data: CreateMemoryData) => 
    api.post<Prompt>('/prompts', data),

  voteOnPoll: (promptId: string, pollOptionId: string) => 
    api.post<{ pollOptions: PollOption[] }>(`/prompts/${promptId}/vote`, { pollOptionId }),

  deletePrompt: (id: string) => 
    api.delete(`/prompts/${id}`),

  likePrompt: (id: string) => 
    api.post<{ liked: boolean; likesCount: number }>(`/prompts/${id}/like`),
};

export const responsesApi = {
  createResponse: (data: CreateResponseData) => 
    api.post<Response>('/responses', data),

  upvoteResponse: (responseId: string) => 
    api.post<{ upvoted: boolean; upvotesCount: number }>(`/responses/${responseId}/upvote`),
};

export const reportsApi = {
  createReport: (data: {
    resourceType: 'PROMPT' | 'RESPONSE';
    resourceId: string;
    reason: string;
  }) => 
    api.post<{ id: string; message: string }>('/reports', data),
};

export interface CreateCommunityData {
  name: string;
  slug: string;
}

export interface CommunityWithStats extends Community {
  _count: {
    prompts: number;
  };
}

export const communitiesApi = {
  getCommunities: () => 
    api.get<CommunityWithStats[]>('/communities'),

  getCommunity: (slug: string) => 
    api.get<CommunityWithStats>(`/communities/${slug}`),

  createCommunity: (data: CreateCommunityData) => 
    api.post<CommunityWithStats>('/communities', data),

  updateCommunity: (slug: string, data: { name: string }) => 
    api.patch<CommunityWithStats>(`/communities/${slug}`, data),

  getCommunityPrompts: (slug: string, params?: { 
    sort?: 'recent' | 'trending'; 
    page?: number; 
    limit?: number; 
  }) => 
    api.get<{
      prompts: Prompt[];
      community: CommunityWithStats;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/communities/${slug}/prompts`, { params }),
};