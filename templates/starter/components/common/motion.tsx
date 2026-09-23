'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { easeStandard } from '@/lib/utils';

/** Fades content up once as it scrolls into view. 400ms, 8px, no stagger. Respects reduced motion. */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay, ease: easeStandard }}
      {...props}
    />
  );
}
