import { Chapter, Choice, GameState, Scene } from '../model/Types';
import { CheckSystem } from './CheckSystem.js';
import { ChoiceExecutor } from './ChoiceExecutor.js';

export class ContentIndex {
  chapters: Record<string, Chapter> = {};
  addChapter(ch: Chapter){ this.chapters[ch.id]=ch; }
  getScene(chapterId:string, sceneId:string): Scene {
    const ch = this.chapters[chapterId];
    if (!ch) throw new Error('Missing chapter '+chapterId);
    const sc = ch.scenes.find(s=>s.id===sceneId);
    if (!sc) throw new Error('Missing scene '+sceneId);
    return sc;
  }
}

export class SceneRouter {
  constructor(private state: GameState, private idx: ContentIndex){}
  current(): Scene { return this.idx.getScene(this.state.chapterId, this.state.sceneId); }
  availableChoices(): Choice[] {
    const scene = this.current();
    return scene.choices.filter(c=>{
      try { CheckSystem.assert(c.requirements, this.state); return true; } catch { return false; }
    });
  }
  applyChoice(choiceId:string){
    const scene = this.current();
    const choice = scene.choices.find(c=>c.id===choiceId);
    if (!choice) throw new Error('Invalid choice');
    try { CheckSystem.assert(choice.requirements, this.state);
      ChoiceExecutor.apply(choice, this.state, true);
    } catch {
      ChoiceExecutor.apply(choice, this.state, false);
    }
    if (choice.next) this.state.sceneId = choice.next;
    this.state.history.push(choiceId);
  }
}