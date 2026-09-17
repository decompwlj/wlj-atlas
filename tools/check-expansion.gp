\\ Compare source fixtures; independently check first, periodic, and final rows.
default(parisizemax,512000000);
ids=["a003726","a004215","a005153","a006093","a006450","a006512","a006753","a006995","a007510","a007770"];
fixtures=0;audited=0;
{
 for(s=1,#ids,
  reference=readstr(Str("tools/fixtures/expansion/",ids[s],".csv"));
  computed=readstr(Str("raw/",ids[s],".csv"));
  if(#reference!=1001,error("Expected 1000 source fixture rows"));
  for(i=2,#reference,
   if(reference[i]!=computed[i],error(Str("Source mismatch ",ids[s]," row ",i-1)));
   fixtures++;
  );
  count=0;
  for(i=2,#computed,
   t=eval(Str("[",computed[i],"]"));
   n=t[1];a=t[2];k=t[3];L=t[4];d=t[5];
   if(k>0,count++);
   if(i<=18 || i%199==0 || i==#computed,
    if(a<=2*d,expected=[0,0,d],
     D=divisors(a-d);best=vecmin(select(x->x>d,D));expected=[best,(a-d)/best,d]);
    if([k,L,d]!=expected,error(Str("Minimal-weight mismatch ",ids[s]," row ",n)));
    audited++;
   );
  );
  if(count!=200000,error(Str("Point count mismatch ",ids[s])));
 );
 print("PASS: ",fixtures," source fixture rows match all five fields.");
 print("PASS: ",audited," sampled decompositions independently checked via sorted divisors.");
 print("PASS: exactly 200000 classified points in each of the ten new sequences.");
}
quit;
