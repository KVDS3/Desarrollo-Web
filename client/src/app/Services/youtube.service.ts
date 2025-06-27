import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private apiKey = 'AIzaSyAlD0FhVj-9aoAYwXAbuMGYsUHc1G9kn6E';
  private apiUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(private http: HttpClient) {}

  getPopularVideos(): Observable<any> {
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('chart', 'mostPopular')
      .set('regionCode', 'MX') // Puedes cambiar el país
      .set('maxResults', '10')
      .set('key', this.apiKey);

    return this.http.get(`${this.apiUrl}/videos`, { params });
  }
  
    searchVideos(query: string): Observable<any> {
    const params = new HttpParams()
      .set('part', 'snippet')
      .set('q', query)
      .set('type', 'video')
      .set('maxResults', '1')
      .set('key', this.apiKey);

    return this.http.get(`${this.apiUrl}/search`, { params });

  }
}
