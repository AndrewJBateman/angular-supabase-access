import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { USER_STORAGE_KEY } from '@shared/constants/constant';
import {
  ApiError,
  createClient,
  Session,
  SupabaseClient,
  User,
  UserCredentials
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

type supabaseResponse = User | Session | ApiError | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabaseClient: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabaseClient = createClient(
      environment.supabase.url,
      environment.supabase.publicKey
    );
    this.setUser();
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  async signIn(credentials: UserCredentials): Promise<supabaseResponse> {
    try {
      const { user, error, ...rest } = await this.supabaseClient.auth.signIn(
        credentials
      );
      this.setUser();
      return error ? error : user;
    } catch (error) {
      console.log(error);
      return error as ApiError;
    }
  }

  // function to sign up user, input user credentials, return promise that is a User or error
  async signUp(credentials: UserCredentials): Promise<supabaseResponse> {
    try {
      const { user, error, ...rest } = await this.supabaseClient.auth.signUp(
        credentials
      );
      this.setUser();
      return error ? error : user;
    } catch (error) {
      console.log(error);
      return error as ApiError;
    }
  }

  signOut(): Promise<{ error: ApiError | null }> {
    this.userSubject.next(null);
    return this.supabaseClient.auth.signOut();
  }

  // store user session in localStorage
  private setUser(): void {
    const session = localStorage.getItem(USER_STORAGE_KEY) as unknown as User;
    this.userSubject.next(session);
  }
}
