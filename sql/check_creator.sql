-- Check league creator
SELECT
  l.id,
  l.name,
  l.creator_id,
  u.email as creator_email
FROM public.leagues l
JOIN auth.users u ON u.id = l.creator_id
WHERE l.id = '88fc13c0-661a-461c-aed5-88210fb98c9e';

-- Also check if f8ecea1d-df19-44a6-80be-21145d235c96 is the creator
SELECT
  CASE
    WHEN creator_id = 'f8ecea1d-df19-44a6-80be-21145d235c96'
    THEN 'YES - This user is the creator'
    ELSE 'NO - This user is NOT the creator'
  END as is_creator,
  creator_id
FROM public.leagues
WHERE id = '88fc13c0-661a-461c-aed5-88210fb98c9e';
