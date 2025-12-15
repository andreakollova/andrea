import React from 'react';

export type Language = 'en' | 'sk';

export interface Point {
  x: number;
  y: number;
}

export interface SectionContent {
  id: string;
  title: string;
  type: 'about' | 'skills' | 'work' | 'experience' | 'contact';
  content: React.ReactNode;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;

export interface GameConfig {
  speed: number;
  segmentSize: number;
  colorSnake: string;
  colorFood: string;
}