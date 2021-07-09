#include <iostream>
#include "generator.h"

using namespace  std;

void display_help()
{
    cout << "Usage: mapdata-generator <SRC> <DEST>" << endl;
    cout << endl;
    cout << "ABOUT" << endl;
    cout << "This tool reads Tiled maps in JSON format and extracts data from it we need" << endl;
    cout << endl;
    cout << "PARAMETERS" << endl;
    cout << "src    The filename of the Tiled json file" << endl;
    cout << "dest   The output filename" << endl;
}

void run(string& src, string& dest)
{
    Generator generator;
    generator.load(src);
    generator.generate();
    generator.save(dest);
}

int main(int argc, char** argv) {
    try
    {
        if (argc == 1 || (argv[1] == "-h" || argv[1] == "--help"))
        {
            display_help();
        }
        else if (argc < 3)
        {
            throw runtime_error("Not enough arguments provided");
        }
        else
        {
            string src = argv[1];
            string dest = argv[2];

            run(src, dest);
        }
    }
    catch (runtime_error& ex)
    {
        cerr << ex.what() << endl;
        return -1;
    }
    catch (exception& ex)
    {
        cerr << ex.what() << endl;
        return -1;
    }
    catch (...)
    {
        cerr << "An unknown error occurred";
        return -1;
    }

    return 0;
}
