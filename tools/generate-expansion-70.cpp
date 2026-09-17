// Run from the project root. C++17, no third-party dependencies.
// Generates consecutive terms through 200,000 decomposable points per sequence.
#include <algorithm>
#include <cstdint>
#include <filesystem>
#include <fstream>
#include <functional>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>
using namespace std;
constexpr int BOUND=20000000, TARGET=200000;
vector<int> spf(BOUND+1);
void require(bool ok,const string& message){if(!ok)throw runtime_error(message);}
int digit_sum(int a){int s=0;for(;a;a/=10)s+=a%10;return s;}
int weight(int a,int d){
 if(a<=2*d)return 0;
 int v=a-d;
 vector<int> divisors{1};
 while(v>1){int p=spf[v],power=1;size_t size=divisors.size();
  do{v/=p;power*=p;for(size_t i=0;i<size;i++)divisors.push_back(divisors[i]*power);}while(v>1&&spf[v]==p);
 }
 int k=a-d;for(int f:divisors)if(f>d)k=min(k,f);return k;
}
void export_sequence(const string& id,int a,function<int(int)> next){
 string path="raw/"+id+".csv";
 require(!filesystem::exists(path),"Refusing to overwrite "+path);
 ofstream out(path);require(bool(out),"Cannot write "+path);out<<"n,a,k,L,d\n";
 int n=1,count=0;
 while(count<TARGET){int b=next(a);require(b>a&&b<=BOUND,"Increase sieve bound for "+id);
  int d=b-a,k=weight(a,d),L=k?(a-d)/k:0;
  require(!k||(k>d&&int64_t(k)*L+d==a),"WLJ invariant failed");
  out<<n<<','<<a<<','<<k<<','<<L<<','<<d<<'\n';
  count+=k>0;n++;a=b;
 }
 out.close();require(bool(out),"Write failed");
 cout<<id<<": "<<count<<" points, "<<n-1<<" terms, successor "<<a<<endl;
}
function<int(int)> matching(function<bool(int)> pred){return [pred](int a){for(int b=a+1;b<=BOUND;b++)if(pred(b))return b;throw runtime_error("Sequence exhausted sieve bound");};}
int main(){
 filesystem::create_directories("raw");
 vector<int> primes;
 for(int i=2;i<=BOUND;i++){
  if(!spf[i]){spf[i]=i;primes.push_back(i);}
  for(int p:primes){if(p>spf[i]||int64_t(i)*p>BOUND)break;spf[i*p]=p;}
 }
 export_sequence("a007528",5,matching([](int v){return v%6==5&&spf[v]==v;}));
 int take=1,remaining=1;
 export_sequence("a007606",1,[&](int a){if(--remaining)return a+1;int skip=take+1;take+=2;remaining=take;return a+skip+1;});
 export_sequence("a007618",5,[](int a){return a+digit_sum(a);});
 export_sequence("a007957",1,matching([](int a){for(;a;a/=10)if(a%2)return true;return false;}));
 export_sequence("a008364",1,matching([](int a){return a%2&&a%3&&a%5&&a%7;}));
 export_sequence("a008846",5,matching([](int a){while(a>1){int p=spf[a];if(p%4!=1)return false;do{a/=p;}while(a>1&&spf[a]==p);}return true;}));
 export_sequence("a008851",0,matching([](int a){return a%5<=1;}));
 export_sequence("a008864",3,matching([](int a){return a>2&&spf[a-1]==a-1;}));
 vector<bool> generated(BOUND+1);
 for(int m=1;m<=BOUND;m++){int image=m+__builtin_popcount(unsigned(m));if(image<=BOUND)generated[image]=true;}
 export_sequence("a010061",1,matching([&](int a){return !generated[a];}));
 export_sequence("a010784",0,matching([](int a){unsigned used=0;do{unsigned bit=1u<<(a%10);if(used&bit)return false;used|=bit;a/=10;}while(a);return true;}));
}
