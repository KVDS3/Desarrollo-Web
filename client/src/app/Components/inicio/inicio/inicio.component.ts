import { Component } from '@angular/core';
import { YoutubeService } from '../../../Services/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  futbolVideo?: SafeResourceUrl;
    basquetVideo?: SafeResourceUrl;
    beisbolVideo?: SafeResourceUrl;
    tenisVideo?: SafeResourceUrl;
    videoFondo!: SafeResourceUrl;


    constructor(
      private youtubeService: YoutubeService,
      private sanitizer: DomSanitizer
    ) {}

 ngOnInit(): void {
    this.loadVideo('fútbol', (url) => this.futbolVideo = url);
    this.loadVideo('básquetbol', (url) => this.basquetVideo = url);
    this.loadVideo('béisbol', (url) => this.beisbolVideo = url);
    this.loadVideo('tenis', (url) => this.tenisVideo = url);
    const fondoVideoId = 'L3374C3OyrY'; // Reemplaza con el ID real de YouTube
    const url = `https://www.youtube.com/embed/${fondoVideoId}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${fondoVideoId}`;
    this.videoFondo = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private loadVideo(query: string, setVideo: (url: SafeResourceUrl) => void) {
    this.youtubeService.searchVideos(query).subscribe(res => {
      const id = res.items[0]?.id?.videoId;
      if (id) {
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
        setVideo(safeUrl);
      }
    });
  }
}
