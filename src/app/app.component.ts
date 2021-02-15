import { Component, OnInit } from '@angular/core';
import { AngularFireLiteFirestore } from 'angularfire-lite';
import { Observable } from 'rxjs';
import { Post } from './post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public firestore: AngularFireLiteFirestore) {
  }

  firestoreData;
  posts: Observable<Post[]>;

  ngOnInit() {

        // Firestore
        this.firestore.read('posts').subscribe((data) => {
          console.log("data", data);
          this.firestoreData = {...data};
          console.log("spread data", this.firestoreData);
      });

  }

}
