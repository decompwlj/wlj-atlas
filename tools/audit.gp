\\ Independent divisor-enumeration audit of every 199th row and the first 17.
\\ Run after generation, from project root: gp -fq tools/audit.gp
\\ Also reproduce the attached 8th-edition prime census below 10^6.
read("tools/kernel.gp");
default(parisizemax,512000000);
ids=["natural", "primes", "composites", "odd", "even", "triangular", "squares", "pentagonal", "pronic", "squarefree", "primes-1-mod-4", "primes-3-mod-4", "a001651", "a001839", "a001855", "a002113", "a006446", "a006567", "a000028", "a000037", "a000069", "a000093", "a000201", "a000378", "a000379", "a000469", "a000788", "a000961", "a000977", "a001043", "a001097", "a001358", "a001359", "a001481", "a001751", "a001952", "a001969", "a002476", "a002822", "a003052", "a003136", "a003277", "a003601", "a003628", "a003631", "a005100", "a005101", "a005349", "a005384", "a005385", "a003726", "a004215", "a005153", "a006093", "a006450", "a006512", "a006753", "a006995", "a007510", "a007770"];
checked=0; census=[0,0,0,0];
{
 for(s=1,#ids,
  lines=readstr(Str("raw/",ids[s],".csv"));
  for(i=2,#lines,
   t=eval(Str("[",lines[i],"]"));
   n=t[1]; a=t[2]; k=t[3]; L=t[4]; d=t[5];
   if(i<=18 || (i%199)==0,
    if(a<=2*d,expected=[0,0,d],
     D=divisors(a-d); best=vecmin(select(x->x>d,D));expected=[best,(a-d)/best,d]);
    if([k,L,d]!=expected,error(Str("Audit mismatch ",ids[s]," n=",n)));
    checked++;
   );
   if(ids[s]=="primes" && a<10^6 && k>0,
    census[1]++;if(k>L,census[2]++);if(L==1,census[3]++);if(k==L,census[4]++);
   );
  );
 );
 if(census!=[78495,18353,5953,12],error(Str("Prime census mismatch: ",census)));
 print("PASS: ",checked," sampled decompositions independently checked via sorted divisors.");
 print("PASS: prime census below 10^6 = ",census," [decomposable, level, level-one, ties].");
}
quit;
