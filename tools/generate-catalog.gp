\\ Version 1.3: 32 sequences selected from decompwlj.com/2dgraphs.php.
\\ Run from project root with empty/missing raw CSVs for these IDs.
\\ Index n=1 enumerates each sequence with the start documented in SOURCES.md.
read("tools/kernel.gp");
default(parisizemax,512000000);
TARGET=200000;
assert_missing(path)={iferr(readstr(path),E,return(1));error(Str("Refusing to append to existing ",path))};
export_step(id,a,next)={
 my(path=Str("raw/",id,".csv"),n=1,count=0,b,t);
 assert_missing(path);
 write(path,"n,a,k,L,d");
 while(count<TARGET,
  b=next(a);
  if(b<=a || b>9007199254740991,error("Increasing safe integer required"));
  t=decomp(a,b);write(path,Str(n,",",a,",",t[1],",",t[2],",",t[3]));
  if(t[1]>0,count++);n++;a=b;
 );
 print(id,": ",count," decomposable points; ",n-1," terms");
};
next_match(a,pred)={my(b=a+1);while(!pred(b),b++);b};
export_pred(id,a,pred)=export_step(id,a,x->next_match(x,pred));
export_formula(id,f)={
 my(path=Str("raw/",id,".csv"),n=1,count=0,a,b,t);
 assert_missing(path);
 write(path,"n,a,k,L,d");
 while(count<TARGET,
  a=f(n);b=f(n+1);
  if(b<=a || b>9007199254740991,error("Increasing safe integer required"));
  t=decomp(a,b);write(path,Str(n,",",a,",",t[1],",",t[2],",",t[3]));
  if(t[1]>0,count++);n++;
 );
 print(id,": ",count," decomposable points; ",n-1," terms");
};
exponent_parity(v)={my(F=factor(v));sum(i=1,matsize(F)[1],hammingweight(F[i,2]))%2};
three_squares(v)={if(!v,return(1));while(v%4==0,v=v/4);v%8!=7};
two_squares(v)={if(!v,return(1));my(F=factor(v));for(i=1,matsize(F)[1],if(F[i,1]%4==3 && F[i,2]%2,return(0)));1};
loeschian(v)={if(!v,return(1));my(F=factor(v));for(i=1,matsize(F)[1],if(F[i,1]%3==2 && F[i,2]%2,return(0)));1};
bit_total(n)={if(n==0,return(0));my(k=#binary(n)-1,p=2^k);k*p/2+n-p+1+bit_total(n-p)};
next_prime_match(a,pred)={my(p=nextprime(a+1));while(!pred(p),p=nextprime(p+1));p};
export_primes(id,a,pred)=export_step(id,a,p->next_prime_match(p,pred));
export_pred("a000028",2,v->exponent_parity(v)==1);
export_pred("a000037",2,v->!issquare(v));
export_pred("a000069",1,v->hammingweight(v)%2==1);
export_formula("a000093",n->sqrtint(n^3));
export_formula("a000201",n->(n+sqrtint(5*n^2))\2);
export_pred("a000378",0,v->three_squares(v));
export_pred("a000379",1,v->exponent_parity(v)==0);
export_pred("a000469",1,v->issquarefree(v) && !isprime(v));
export_formula("a000788",n->bit_total(n));
export_pred("a000961",1,v->isprimepower(v)>0);
export_pred("a000977",30,v->omega(v)>=3);
PP=primes(TARGET+200);
export_formula("a001043",n->PP[n]+PP[n+1]);
export_primes("a001097",3,p->isprime(p-2)||isprime(p+2));
export_pred("a001358",4,v->bigomega(v)==2);
export_primes("a001359",3,p->isprime(p+2));
export_pred("a001481",0,v->two_squares(v));
export_pred("a001751",2,v->isprime(v)||(v%2==0 && isprime(v/2)));
export_formula("a001952",n->2*n+sqrtint(2*n^2));
export_pred("a001969",0,v->hammingweight(v)%2==0);
export_primes("a002476",7,p->p%6==1);
export_pred("a002822",1,v->isprime(6*v-1)&&isprime(6*v+1));
\\ Mark all decimal generators up to a finite, checked bound.
SELF_LIMIT=3200000; GENERATED=vector(SELF_LIMIT);
for(v=1,SELF_LIMIT,my(w=v+sumdigits(v));if(w<=SELF_LIMIT,GENERATED[w]=1));
export_pred("a003052",1,v->if(v>SELF_LIMIT,error("Increase SELF_LIMIT"),!GENERATED[v]));
export_pred("a003136",0,v->loeschian(v));
export_pred("a003277",1,v->gcd(v,eulerphi(v))==1);
export_pred("a003601",1,v->sigma(v)%numdiv(v)==0);
export_primes("a003628",5,p->p%8==5||p%8==7);
export_primes("a003631",2,p->p%5==2||p%5==3);
export_pred("a005100",1,v->sigma(v)<2*v);
export_pred("a005101",12,v->sigma(v)>2*v);
export_pred("a005349",1,v->v%sumdigits(v)==0);
export_primes("a005384",2,p->isprime(2*p+1));
export_primes("a005385",5,p->isprime((p-1)/2));

quit;
