import { Component } from '@angular/core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent {
  teams = [
    { name: 'Team Alpha', members: 5 },
    { name: 'Team Beta', members: 3 },
    { name: 'Team Gamma', members: 4 }
  ];
}
