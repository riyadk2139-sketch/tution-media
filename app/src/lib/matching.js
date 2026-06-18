// Match score between a tutor profile and a listing.
//   subjects 50 | level 20 | area 20 | verification 10 | + student-fit boost

function tokenize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
}

function levelMatch(tutorLevels, listingLevel) {
  const lTok = tokenize(listingLevel);
  return (tutorLevels || []).some(tl => {
    const tTok = tokenize(tl);
    return lTok.some(t => tTok.includes(t)) || tTok.some(t => lTok.includes(t));
  });
}

function areaMatch(tutorAreas, listingArea) {
  const la = (listingArea || '').toLowerCase();
  return (tutorAreas || []).some(a => la.includes((a || '').toLowerCase()) && a.length > 1);
}

export function computeMatch(tutor, listing, { feedbackAvg = 0 } = {}) {
  if (!tutor || !listing) return 0;
  const lSubjects = listing.subjects || [];
  const tSubjects = tutor.subjects || [];
  const subjOverlap = lSubjects.length === 0
    ? 0
    : lSubjects.filter(x => tSubjects.includes(x)).length / lSubjects.length;
  const lvl = levelMatch(tutor.levels, listing.level) ? 1 : 0;
  const area = areaMatch(tutor.areas, listing.area) ? 1 : 0;
  const tier = Math.min((tutor.verifyTier || 0) / 3, 1);
  const boost = feedbackAvg > 0 ? Math.max(0, (feedbackAvg - 3) * 2) : 0;

  const score = 50 * subjOverlap + 20 * lvl + 20 * area + 10 * tier + boost;
  return Math.max(0, Math.min(100, Math.round(score)));
}
