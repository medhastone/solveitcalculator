import React from 'react';
import { Metadata } from 'next';
import BirthdayTrackerClient from './BirthdayTrackerClient';

export const metadata: Metadata = {
  title: 'Birthday Tracker & Solar Orbit | SolveIt',
  description: 'Track deterministic countdowns to your next birthday, calculate completed solar orbits around the Sun, and unveil biological, astronomical, and generational milestones with sub-second accuracy.',
};

export default function BirthdayTrackerPage() {
  return <BirthdayTrackerClient />;
}
