'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';

export interface Profile {
  name: string;
}

export interface Reflection {
  text: string;
  date: string;
}

export interface Story {
  id: number;
  tag: string;
  tagCls: string;
  title: string;
  excerpt: string;
  guideName: string;
  guideBio: string;
  circleId: string;
  body: string[];
}

export interface Circle {
  id: string;
  title: string;
  guide: string;
  storyId: number;
  date: string;
  time: string;
  total: number;
  origLeft: number;
  link: string;
}

interface AppState {
  profile: Profile | null; // This will now hold pseudonym or null
  joinedCircles: string[];
  reflections: Reflection[];
  waitlistEmails: string[];
  guideApplied: boolean;
  isListener: boolean;
  publishedStories: any[];
  activeStoryId: number | null;
  activeModal: 'waitlist' | 'safety' | 'redflag' | null;
  theme: 'light' | 'dark';
}

interface AppContextType extends AppState {
  setProfile: (profile: Profile) => void;
  joinCircle: (id: string) => void;
  addReflection: (text: string) => void;
  addToWaitlist: (email: string) => void;
  applyAsGuide: () => void;
  setIsListener: (val: boolean) => void;
  publishStory: (story: any) => void;
  setActiveStoryId: (id: number | null) => void;
  openModal: (type: 'waitlist' | 'safety' | 'redflag') => void;
  closeModal: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, supabase } = useAuth();
  
  const [state, setState] = useState<AppState>({
    profile: null,
    joinedCircles: [],
    reflections: [],
    waitlistEmails: [],
    guideApplied: false,
    isListener: false,
    publishedStories: [],
    activeStoryId: null,
    activeModal: null,
    theme: 'light',
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('btl4');
    if (saved) {
      try {
        setState((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('btl4', JSON.stringify(state));
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state, isLoaded]);

  const setProfile = (profile: Profile) => setState((s) => ({ ...s, profile }));
  
  const joinCircle = (id: string) => {
    if (!state.joinedCircles.includes(id)) {
      setState((s) => ({ ...s, joinedCircles: [...s.joinedCircles, id] }));
    }
  };

  const addReflection = (text: string) => {
    const now = new Date();
    const date = now.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setState((s) => ({ ...s, reflections: [{ text, date }, ...s.reflections] }));
  };

  const addToWaitlist = (email: string) => setState((s) => ({ ...s, waitlistEmails: [...s.waitlistEmails, email] }));
  
  const applyAsGuide = () => setState((s) => ({ ...s, guideApplied: true }));
  
  const setIsListener = (isListener: boolean) => setState((s) => ({ ...s, isListener }));

  const publishStory = (story: any) => setState((s) => ({ ...s, publishedStories: [story, ...s.publishedStories] }));

  const setActiveStoryId = (id: number | null) => setState((s) => ({ ...s, activeStoryId: id }));

  return (
    <AppContext.Provider value={{ 
      ...state, 
      setProfile, 
      joinCircle, 
      addReflection, 
      addToWaitlist, 
      applyAsGuide, 
      setIsListener,
      publishStory,
      setActiveStoryId,
      openModal: (type: 'waitlist' | 'safety' | 'redflag') => setState((s) => ({ ...s, activeModal: type })),
      closeModal: () => setState((s) => ({ ...s, activeModal: null })),
      toggleTheme: () => setState((s) => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const STORIES: Story[] = [
  {id:1,tag:'Displacement & Belonging',tagCls:'',title:'The Weight of Two Skies',excerpt:'"The night we crossed, my daughter asked if the stars were the same ones she would see at home. I didn\'t know how to tell her that home was behind us."',guideName:'Amira K.',guideBio:'Amira K. crossed three borders before finding stability in Hyderabad. She now volunteers with a refugee resettlement organisation and leads Circles on displacement and the quiet art of rebuilding identity.',circleId:'c1',body:['The night we crossed, my daughter asked me if the stars were the same ones she would see at home. I didn\'t know how to tell her that home was behind us now, receding in the dark water like a dying torch. She was six. She thought we were on an adventure. I let her think that.','I am a dentist. Was a dentist. In my country, I ran a practice of twelve people. I drove a good car. My children went to school in uniforms I ironed every Sunday night while watching films with my husband. I had a life so ordinary I sometimes complained about it. I did not know what I had until the shells started falling and ordinary became the most precious thing I could imagine.','What they don\'t tell you about being a refugee is that the worst part is not the crossing, not the camps, not the bureaucracy. The worst part is becoming invisible in the place that saved you. People see your story &mdash; the war, the journey &mdash; and they stop seeing you. I am not my displacement. I am a woman who loves mangoes on summer evenings, who cries at bad films, who argued with her mother about whether cumin belongs in lentil soup. I have carried her across three borders, through ten years, across the memory of two skies. And here I am. Still here. Still her.']},
  {id:2,tag:'Mental Health',tagCls:'crimson',title:'The Voltage of Being',excerpt:'"Mania felt like being plugged directly into the sun. I understood why people chase it &mdash; the certainty, the feeling of living at full resolution."',guideName:'Dev R.',guideBio:'Dev R. was diagnosed with Bipolar I at 27, after a manic episode that cost him his job and nearly his marriage. He now works as a mental health advocate and leads Circles on navigating the terrain of mood disorders with honesty.',circleId:'c2',body:['Mania felt like being plugged directly into the sun. I understood, in those weeks, why people chase it &mdash; the confidence, the certainty, the feeling that you are finally living at full resolution. I wrote sixty pages of a novel in a single weekend. I called people I hadn\'t spoken to in years. I spent money I didn\'t have on instruments I never learned to play. It felt, with an absolute clarity I have never since replicated, like the truth of who I was.','And then came the crash. I want to be careful here, because I\'ve tried many times to describe the depression that follows a manic episode and I always under-describe it. It is not sadness. Sadness is human and warm. This was a cold, fluorescent absence. The sense that someone had switched off something essential inside me and left the shell to manage. I lay in bed for three weeks. My wife brought food to the bedroom door and I heard her crying in the kitchen when she thought I was asleep.','What I know now, eleven years into living with this diagnosis, is that the disorder is not the enemy. The stigma is. The silences are. Recovery has not been the elimination of the extremes but the gradual, imperfect, sometimes beautiful navigation of them. I have learned which rooms inside myself to furnish and which to simply walk past. I am not cured. I am not broken. I am, with enormous effort and occasional grace, alive and learning.']},
  {id:3,tag:'Identity & Redemption',tagCls:'sage',title:'What My Hands Knew',excerpt:'"The gang did not recruit me. It absorbed me, the way water absorbs something dropped into it &mdash; quietly, completely, without announcement."',guideName:'Marcus T.',guideBio:'Marcus T. spent eight years inside a gang structure and four years incarcerated. He now works in youth intervention and mentoring in Bengaluru, and believes no story is too far gone to find its way back.',circleId:'c3',body:['The gang did not recruit me. It absorbed me, the way water absorbs something dropped into it &mdash; quietly, completely, without announcement. I was twelve, my father was absent, my mother was working three jobs, and the street outside my building had more warmth and certainty in it than any room in our flat. I want you to understand this before you judge what came next. We all belong somewhere. I belonged there.','I have done things I will not describe here. Not because I am protecting myself &mdash; I have done that work in other rooms, with other people, for many painful years &mdash; but because this is not a confession. This is a direction. The day I left, I was twenty-three. I had just held a man I knew while he bled out on a pavement. His name was Jerome. He was funny. His name died on a Tuesday.','Jerome is the reason I do this work. Not from guilt alone &mdash; guilt is a room you can get lost in. But from the clarity that his death gave me: that this path only goes one way, and I had a choice, still, to walk a different one. I have also sat across a table from a fourteen-year-old who looked exactly like me at twelve, and I have said: I see you. You are not who they say you are. And I have meant every word.']},
  {id:4,tag:'Gender & Self',tagCls:'',title:'The Body Comes Home',excerpt:'"The first time someone used my correct name in public, I stood very still. I was afraid that if I moved, the moment would shatter."',guideName:'Leela P.',guideBio:'Leela P. transitioned at 34, after decades of quietly knowing something was different. She is a software engineer, a poet, and a gardener. She leads Circles on gender, identity, and the quiet courage of becoming.',circleId:'c4',body:['The first time someone used my correct name in public, I stood very still. I was afraid that if I moved, the moment would shatter. It didn\'t. It held. A barista called me Leela and moved on without ceremony, the way you do with any name, and I stood there for a moment with my eyes full and my hands wrapped around a paper cup and I thought: this. This is what I wanted. This ordinary, unremarkable, extraordinary thing.','I came out at thirty-four. My friends sometimes ask why I waited so long, and the honest answer is that I didn\'t have the language for what I was until I found it accidentally, at three in the morning, on a forum for women. I had spent my whole life moving around the truth of myself the way you move around furniture in the dark &mdash; carefully, by feel, never looking directly at it. Transition was, after thirty-four years of waiting, the act of turning on the light.','I will not pretend it was only beautiful. My family took two years to come back to me. There was a period of six months where I could not afford my medication and I did not recognise the face in the mirror, and I survived it one morning at a time. But I am here. And the body, after thirty-four years of waiting, has finally come home to itself. Not perfectly &mdash; bodies rarely arrive perfectly &mdash; but mine. Completely, irrevocably, tenderly mine.']}
];

export const CIRCLES: Circle[] = [
  {id:'c1',title:"Finding Home: A Refugee's Rebuilding",guide:'Amira K.',storyId:1,date:'May 10, 2026',time:'7:30 PM IST',total:8,origLeft:3,link:'https://meet.jit.si/BetweenTheLines-Circle-1234'},
  {id:'c2',title:'The Voltage of Being: Living with Bipolar',guide:'Dev R.',storyId:2,date:'May 14, 2026',time:'8:00 PM IST',total:8,origLeft:6,link:'https://meet.jit.si/BetweenTheLines-Circle-5678'},
  {id:'c3',title:'What My Hands Knew: Redemption & Identity',guide:'Marcus T.',storyId:3,date:'May 17, 2026',time:'6:00 PM IST',total:8,origLeft:2,link:'https://meet.jit.si/BetweenTheLines-Circle-9012'},
  {id:'c4',title:'The Body Comes Home: Gender & Becoming',guide:'Leela P.',storyId:4,date:'May 22, 2026',time:'7:00 PM IST',total:8,origLeft:5,link:'https://meet.jit.si/BetweenTheLines-Circle-3456'},
];
