-- Manually add membership for user to fix the issue
-- This will allow the participant insert to work

INSERT INTO public.league_memberships (league_id, user_id, role, has_paid)
VALUES (
  '88fc13c0-661a-461c-aed5-88210fb98c9e',
  'f8ecea1d-df19-44a6-80be-21145d235c96',
  'member',
  true
)
ON CONFLICT DO NOTHING;

-- Verify it was created
SELECT * FROM public.league_memberships
WHERE league_id = '88fc13c0-661a-461c-aed5-88210fb98c9e'
AND user_id = 'f8ecea1d-df19-44a6-80be-21145d235c96';
